import { Link } from "react-router-dom";
import { Video } from "../../types";

const VideoTeaser = ({ video }: { video: Video }) => {
  return (
    <Link
      to={`/watch/${video.videoId}`}
      className="block mb-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300"
    >
      <div className="relative w-full pt-[56.25%] overflow-hidden">
        <img
          src={`http://localhost/youtube-clone/server/thumbnails/${video.thumbnail}.${video.thumbnailExt}`}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {video.title}
        </h2>
        <p className="text-gray-600 line-clamp-2">{video.description}</p>
      </div>
    </Link>
  );
};

export default VideoTeaser;
