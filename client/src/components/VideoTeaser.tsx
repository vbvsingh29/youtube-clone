import { Link } from "react-router-dom";
import { Video } from "../../types";
import s3 from "../../aws/aws.config";
import { AWS_BUCKET_NAME } from "../utils/constants";

const VideoTeaser = ({ video }: { video: Video }) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: AWS_BUCKET_NAME,
    Key: `thumbnails/${video.thumbnail}.${video.thumbnailExt}`,
    // Expires: signedUrlExpireSeconds
  });
  return (
    <Link
      to={`/watch/${video.videoId}`}
      className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
    >
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        <img
          src={url}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      </div>
      <div className="p-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {video.title}
        </h2>
        <p className="text-gray-600 line-clamp-2">{video.description}</p>
      </div>
    </Link>
  );
};

export default VideoTeaser;
