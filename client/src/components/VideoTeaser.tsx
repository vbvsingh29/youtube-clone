import { Link } from "react-router-dom";
import { Video } from "../../types";

const VideoTeaser = ({ video }: { video: Video }) => {
  return (
    <Link to={`/watch/${video.videoId}`} className="block mb-6">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {video.title}
        </h2>
        <p className="text-gray-600">{video.description}</p>
      </div>
    </Link>
  );
};

export default VideoTeaser;
