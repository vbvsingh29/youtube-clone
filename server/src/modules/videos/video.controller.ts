import busboy from "busboy";
import aws from "aws-sdk";
import fs from "fs";
import { Request, Response } from "express";
import { createVideo, findVideo, findVideos } from "./video.service";
import { StatusCodes } from "http-status-codes";
import { Video } from "./video.model";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";
import { AWS_BUCKET_NAME } from "../../utils/constants";
import s3 from "../../../aws/aws.config";

const VIDEO_MIME_TYPES = ["video/mp4"];
const IMG_MIME_TYPES = ["image/jpg", "image/jpeg", "image/png"];
const CHUNK_SIZE_IN_BYTES = 1000000; //1mb

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
    const bb = busboy({ headers: req.headers });

    const user = res.locals.user;
    const video = await createVideo({ owner: user._id });

    bb.on("file", async (_, file, info) => {
      if (!VIDEO_MIME_TYPES.includes(info.mimeType)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid File Type");
      }
      const extension = info.mimeType.split("/")[1];
      const fileName = `${video.videoId}.${extension}`;
      const folderName = "videos";

      const params: aws.S3.PutObjectRequest = {
        Bucket: AWS_BUCKET_NAME || "default",
        Key: `${folderName}/${fileName}`,
        Body: file,
        ContentType: info.mimeType,
      };

      try {
        await s3.upload(params).promise();
        video.extension = extension;
        video.s3Key = `${folderName}/${fileName}`;
        await video.save();
      } catch (e) {
        console.error("Error uploading video to S3:", e);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Error uploading video");
      }
    });

    bb.on("close", () => {
      res.writeHead(StatusCodes.CREATED, {
        connection: "close",
        "Content-Type": "application/json",
      });

      res.write(JSON.stringify(video));
      res.end();
    });

    return req.pipe(bb);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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

    const bb = busboy({ headers: req.headers });
    let thumbnail: string | null = null;
    let thumbnailExt: string | null = null;

    bb.on("file", async (_, file, info) => {
      if (!IMG_MIME_TYPES.includes(info.mimeType)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid File Type");
      }

      const extension = info.mimeType.split("/")[1];
      const fileName = `${video.videoId}.${extension}`;
      const folderName = "thumbnails";

      const params: aws.S3.PutObjectRequest = {
        Bucket: AWS_BUCKET_NAME || "default",
        Key: `${folderName}/${fileName}`,
        Body: file,
        ContentType: info.mimeType,
      };

      thumbnail = `${videoId}`;
      thumbnailExt = extension;

      try {
        await s3.upload(params).promise();
        thumbnail = `${videoId}`;
        thumbnailExt = extension;
        await video.save();
      } catch (e) {
        console.error("Error uploading thumbnail to S3:", e);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Error uploading video");
      }
    });

    bb.on("field", (name, val, _) => {
      if (name === "description") {
        video.description = val;
      } else if (name === "title") {
        video.title = val;
      } else if (name === "published") {
        video.published = val === "true";
      }
    });

    bb.on("finish", async () => {
      if (thumbnail !== null && thumbnailExt !== null) {
        video.thumbnail = thumbnail;
        video.thumbnailExt = thumbnailExt;
      }
      await video.save();
      return res.status(StatusCodes.OK).send(video);
    });

    req.pipe(bb);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

export async function findVideosHandler(_: Request, res: Response) {
  try {
    const videos = await findVideos();

    return res.status(StatusCodes.OK).send(videos);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function streamVideoHandlers(req: Request, res: Response) {
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

    const filePath = getPath({
      videoId: videoId,
      extension: video.extension,
    });

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
      "Cross-Origin_Resource-Policy": "cross-origin",
    };

    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

    const videoStream = fs.createReadStream(filePath, {
      start: chunkStart,
      end: chunkEnd,
    });

    videoStream.pipe(res);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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

    const { ContentLength: fileSizeInBytes } = await s3
      .headObject({ Bucket: AWS_BUCKET_NAME || "", Key: video.s3Key })
      .promise();

    if (fileSizeInBytes === undefined) {
      throw new Error("File size not available");
    }

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
      "Cross-Origin_Resource-Policy": "cross-origin",
    };

    res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

    // Stream video content from S3
    const s3Stream = s3
      .getObject({
        Bucket: AWS_BUCKET_NAME || "",
        Key: video.s3Key,
        Range: `bytes=${chunkStart}-${chunkEnd}`,
      })
      .createReadStream();

    s3Stream.pipe(res);
  } catch (e: any) {
    console.error("Error streaming video:", e);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Internal Server Error");
  }
}
