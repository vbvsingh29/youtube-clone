import { Video, VideoModel } from "./video.model";

export function createVideo({ owner }: { owner: string }) {
  try {
    return VideoModel.create({ owner });
  } catch (e: any) {
    throw e;
  }
}

export function findVideo(videoId: Video["videoId"]) {
  try {
    return VideoModel.findOne({ videoId });
  } catch (e: any) {
    throw e;
  }
}

export function findVideos() {
  return VideoModel.find({
    published: true,
  }).lean();
}
