import { useParams } from "react-router-dom";
import { API_ENDPOINT } from "../../utils/constants";
import { useVideo } from "../../../context/videos";
import VideoTeaser from "../../components/VideoTeaser";

const WatchVideo = () => {
  const { query } = useParams();
  const { videos } = useVideo();

  const video = videos?.find((v) => v.videoId === query);
  const otherVideos = videos?.filter((v) => v.videoId !== query).slice(0, 6);

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        Loading video details...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Details */}
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-4">
            <video
              className="w-full h-full"
              src={`${API_ENDPOINT}/api/videos/${query}`}
              controls
              autoPlay
              id="video-player"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{video.title}</h1>
          
          <div className="bg-zinc-800 rounded-xl p-4 mt-4 shadow-md text-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2 text-xs sm:text-sm text-zinc-400">
              <span>Uploaded on {new Date(video.createdAt).toLocaleDateString()}</span>
              {video.sourceCode && (
                <a
                  href={video.sourceCode}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                >
                  Source Code
                </a>
              )}
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
              {video.description || "No description provided for this video."}
            </p>
          </div>
        </div>

        {/* Right Column: Recommended List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">Recommended</h3>
          <div className="flex flex-col gap-4">
            {otherVideos && otherVideos.length > 0 ? (
              otherVideos.map((v) => (
                <VideoTeaser key={v.videoId} video={v} />
              ))
            ) : (
              <p className="text-zinc-500 text-sm">No other videos available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
