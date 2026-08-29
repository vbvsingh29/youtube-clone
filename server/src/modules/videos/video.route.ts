import express from "express";
import requireUser from "../../middleware/requireUser";
import {
  findVideosHandler,
  streamVideoHandler,
  streamThumbnailHandler,
  updateVideoHandler,
  uploadVideoHandler,
  deleteVideoHandler,
  deleteVideosHandler,
} from "./video.controller";

const router = express.Router();

router.post("/", requireUser, uploadVideoHandler);
router.patch("/:videoId", requireUser, updateVideoHandler);
router.get("/", findVideosHandler);
router.get("/:videoId", streamVideoHandler);
router.get("/:videoId/thumbnail", streamThumbnailHandler);
router.delete("/:videoId", deleteVideoHandler);
router.delete("/", deleteVideosHandler);

export default router;
