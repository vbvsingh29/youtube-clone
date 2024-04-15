import busboy from "busboy";
import fs from "fs";
import { Request, Response } from "express";
import { createVideo, findVideo, findVideos } from "./video.service";
import { StatusCodes } from "http-status-codes";
import { Video } from "./video.model";
import { UpdateVideoBody, UpdateVideoParams } from "./video.schema";

const MIME_TYPES = ["video/mp4"];
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

export async function uploadVideoHandler(req: Request, res: Response) {
  try {
    const bb = busboy({ headers: req.headers });

    const user = res.locals.user;
    const video = await createVideo({ owner: user._id });

    bb.on("file", async (_, file, info) => {
      if (!MIME_TYPES.includes(info.mimeType)) {
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid File Type");
      }
      const extension = info.mimeType.split("/")[1];
      const filePath = getPath({ videoId: video.videoId, extension });

      video.extension = extension;

      await video.save();

      const stream = fs.createWriteStream(filePath);

      file.pipe(stream);
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
    const { description, title, published } = req.body;
    const { _id: userId } = res.locals.user;
    const video = await findVideo(videoId);

    if (!video) {
      return res.status(StatusCodes.NOT_FOUND).send("Video Not Found");
    }

    if (String(video.owner) !== String(userId)) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
    }

    video.title = title;
    video.description = description;
    video.published = published;

    await video.save();

    return res.status(StatusCodes.OK).send(video);
  } catch (e: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
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
    //   "Cross-Origin_Resource-Policy": "cross-origin",
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
