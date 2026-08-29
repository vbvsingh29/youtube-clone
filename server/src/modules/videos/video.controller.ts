import busboy from "busboy";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { createVideo, findVideo, findVideos } from "./video.service";
import { StatusCodes } from "http-status-codes";
import { Video, VideoModel } from "./video.model";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
import { ADMIN_SECRET, ADMIN_USERNAME } from "../../utils/constants";

const VIDEO_MIME_TYPES = ["video/mp4"];
const IMG_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png"];
const CHUNK_SIZE_IN_BYTES = 1000000; //1mb

const videosDir = path.join(process.cwd(), "videos");
const thumbnailsDir = path.join(process.cwd(), "thumbnails");

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

function getPath({
  videoId,
  extension,
}: {
  videoId: Video["videoId"];
  extension: Video["extension"];
}) {
  return `${process.cwd()}/videos/${videoId}.${extension}`;
}

function getImgPath({
  thumbnail,
  extension,
}: {
  thumbnail: Video["thumbnail"];
  extension: Video["thumbnailExt"];
}) {
  return `${process.cwd()}/thumbnails/${thumbnail}.${extension}`;
}

export async function uploadVideoHandler(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
    }

    // 1. Enforce max 5 videos limit per account
    const videoCount = await VideoModel.countDocuments({ owner: user._id });
    if (videoCount >= 5) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Upload limit reached. You can upload a maximum of 5 videos on the free tier.");
    }

    // 2. Enforce max 10MB file size limit
    const contentLength = req.headers["content-length"];
    if (contentLength && Number(contentLength) > 10 * 1024 * 1024) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("File size exceeds the 10MB limit for the free tier.");
    }

    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
      },
    });

    const video = await createVideo({ owner: user._id });
    const uploadPromises: Promise<any>[] = [];

    bb.on("file", (_, file, info) => {
      if (!VIDEO_MIME_TYPES.includes(info.mimeType)) {
        const p = VideoModel.deleteOne({ _id: video._id });
        uploadPromises.push(p.then(() => { throw new Error("Invalid File Type"); }));
        file.resume();
        return;
      }
      const extension = info.mimeType.split("/")[1];
      const videoPath = getPath({ videoId: video.videoId, extension });

      const uploadPromise = new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(videoPath);
        file.pipe(writeStream);
        writeStream.on("finish", async () => {
          try {
            video.extension = extension;
            video.s3Key = `local:${video.videoId}.${extension}`;
            await video.save();
            resolve(null);
          } catch (e) {
            reject(e);
          }
        });
        writeStream.on("error", async (err) => {
          console.error("Local video write error:", err);
          await VideoModel.deleteOne({ _id: video._id });
          try { fs.unlinkSync(videoPath); } catch {}
          reject(err);
        });
      });
      uploadPromises.push(uploadPromise);
    });

    bb.on("close", async () => {
      try {
        if (uploadPromises.length === 0) {
          await VideoModel.deleteOne({ _id: video._id });
          if (!res.headersSent) {
            return res.status(StatusCodes.BAD_REQUEST).send("No video file uploaded");
          }
          return;
        }

        await Promise.all(uploadPromises);

        if (res.headersSent) return;

        res.status(StatusCodes.CREATED).json(video);
      } catch (err: any) {
        if (!res.headersSent) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error uploading video: " + err.message);
        }
      }
    });

    return req.pipe(bb);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function updateVideoHandler(
  req: Request<UpdateVideoParams, {}, UpdateVideoBody>,
  res: Response
) {
  try {
    const { videoId } = req.params;
    const { _id: userId } = res.locals.user;

    const video = await findVideo(videoId);
    if (!video) {
      return res.status(StatusCodes.NOT_FOUND).send("Video Not Found");
    }

    if (String(video.owner) !== String(userId)) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
    }

    // Limit thumbnail file uploads to 2MB
    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1,
      },
    });
    let thumbnail: string | null = null;
    let thumbnailExt: string | null = null;
    const uploadPromises: Promise<any>[] = [];

    bb.on("file", (_, file, info) => {
      if (!IMG_MIME_TYPES.includes(info.mimeType)) {
        const p = Promise.reject(new Error("Invalid File Type"));
        uploadPromises.push(p);
        file.resume();
        return;
      }

      const extension = info.mimeType.split("/")[1];
      const thumbPath = getImgPath({ thumbnail: video.videoId, extension });

      const p = new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(thumbPath);
        file.pipe(writeStream);
        writeStream.on("finish", () => {
          thumbnail = `${videoId}`;
          thumbnailExt = extension;
          resolve(null);
        });
        writeStream.on("error", (err) => {
          try { fs.unlinkSync(thumbPath); } catch {}
          reject(err);
        });
      });
      uploadPromises.push(p);
    });

    bb.on("field", (name, val, _) => {
      if (name === "description") {
        video.description = val;
      } else if (name === "title") {
        video.title = val;
      } else if (name === "published") {
        video.published = val === "true";
      } else if (name === "sourceCode") {
        video.sourceCode = val;
      }
    });

    bb.on("close", async () => {
      try {
        await Promise.all(uploadPromises);

        if (res.headersSent) return;

        if (thumbnail !== null && thumbnailExt !== null) {
          video.thumbnail = thumbnail;
          video.thumbnailExt = thumbnailExt;
        }
        await video.save();
        return res.status(StatusCodes.OK).send(video);
      } catch (err: any) {
        if (!res.headersSent) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error uploading thumbnail: " + err.message);
        }
      }
    });

    req.pipe(bb);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function findVideosHandler(req: Request, res: Response) {
  try {
    const user = res.locals.user;
    const { q, adminSecret, adminUsername } = req.query;

    let queryObj: any = {};

    if (adminSecret === ADMIN_SECRET && adminUsername === ADMIN_USERNAME) {
      queryObj = {};
    } else if (user) {
      // User is logged in: see public videos OR their own videos (public or private)
      queryObj = {
        $or: [
          { published: true },
          { owner: user._id }
        ]
      };
    } else {
      // Guest: can only see public videos
      queryObj = { published: true };
    }

    if (q) {
      // If a search query is provided, match by title or description case-insensitively
      queryObj = {
        $and: [
          queryObj,
          {
            $or: [
              { title: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } }
            ]
          }
        ]
      };
    }

    const videos = await VideoModel.find(queryObj).lean();
    return res.status(StatusCodes.OK).send(videos);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function streamVideoHandler(req: Request, res: Response) {
  try {
    const { videoId } = req.params;

    const range = req.headers.range;

    if (!range) {
      return res.status(StatusCodes.BAD_REQUEST).send("Range must be provided");
    }
    const video = await findVideo(videoId);

    if (!video) {
      return res.status(StatusCodes.NOT_FOUND).send("Video Not Found");
    }

    // Check privacy: if not published/public, only allow the owner
    if (!video.published) {
      const user = res.locals.user;
      if (!user || String(video.owner) !== String(user._id)) {
        return res.status(StatusCodes.FORBIDDEN).send("This video is private");
      }
    }

    const filePath = getPath({
      videoId: videoId,
      extension: video.extension,
    });

    if (!fs.existsSync(filePath)) {
      return res.status(StatusCodes.NOT_FOUND).send("Video file not found on disk");
    }

    const fileSizeInBytes = fs.statSync(filePath).size;

    const chunkStart = Number(range.replace(/\D/g, ""));
    const chunkEnd = Math.min(
      chunkStart + CHUNK_SIZE_IN_BYTES,
      fileSizeInBytes - 1
    );

    const contentLength = chunkEnd - chunkStart + 1;

    const headers = {
      "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
      "Accept-Ranges": "bytes",
      "Content-length": contentLength,
      "Content-Type": `video/${video.extension}`,
      "Cross-Origin-Resource-Policy": "cross-origin",
    };

    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

    const videoStream = fs.createReadStream(filePath, {
      start: chunkStart,
      end: chunkEnd,
    });

    videoStream.pipe(res);
  } catch (e: any) {
    console.error("Error streaming video:", e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function streamThumbnailHandler(req: Request, res: Response) {
  try {
    const { videoId } = req.params;
    const video = await findVideo(videoId);

    if (!video || !video.thumbnail || !video.thumbnailExt) {
      return res.status(StatusCodes.NOT_FOUND).send("Thumbnail Not Found");
    }

    // Check privacy
    if (!video.published) {
      const user = res.locals.user;
      if (!user || String(video.owner) !== String(user._id)) {
        return res.status(StatusCodes.FORBIDDEN).send("This video is private");
      }
    }

    const filePath = getImgPath({
      thumbnail: video.videoId,
      extension: video.thumbnailExt,
    });

    if (!fs.existsSync(filePath)) {
      return res.status(StatusCodes.NOT_FOUND).send("Thumbnail file not found on disk");
    }

    return res.sendFile(filePath);
  } catch (e: any) {
    console.error("Error sending thumbnail:", e);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
}

export async function deleteVideoHandler(req: Request, res: Response) {
  try {
    const { videoId } = req.params;
    const adminSecret = req.headers["admin-secret"] || req.query.adminSecret;
    const adminUsername = req.headers["admin-username"] || req.query.adminUsername;

    if (adminSecret !== ADMIN_SECRET || adminUsername !== ADMIN_USERNAME) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized Admin Access");
    }

    const video = await findVideo(videoId);
    if (!video) {
      return res.status(StatusCodes.NOT_FOUND).send("Video Not Found");
    }

    // Delete local files
    const videoPath = getPath({ videoId: video.videoId, extension: video.extension });
    const thumbPath = getImgPath({ thumbnail: video.videoId, extension: video.thumbnailExt });

    try { fs.unlinkSync(videoPath); } catch {}
    try { fs.unlinkSync(thumbPath); } catch {}

    // Delete database record
    await VideoModel.deleteOne({ _id: video._id });

    return res.status(StatusCodes.OK).send({ message: "Video deleted successfully" });
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function deleteVideosHandler(req: Request, res: Response) {
  try {
    const adminSecret = req.headers["admin-secret"] || req.query.adminSecret;
    const adminUsername = req.headers["admin-username"] || req.query.adminUsername;

    if (adminSecret !== ADMIN_SECRET || adminUsername !== ADMIN_USERNAME) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized Admin Access");
    }

    // Read and delete all files in local video/thumbnail directories
    const videosDir = path.join(process.cwd(), "videos");
    const thumbnailsDir = path.join(process.cwd(), "thumbnails");

    try {
      const files = fs.readdirSync(videosDir);
      for (const file of files) {
        fs.unlinkSync(path.join(videosDir, file));
      }
    } catch {}

    try {
      const files = fs.readdirSync(thumbnailsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(thumbnailsDir, file));
      }
    } catch {}

    // Delete all records in database
    await VideoModel.deleteMany({});

    return res.status(StatusCodes.OK).send({ message: "All videos cleaned up successfully" });
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
