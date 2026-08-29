import { useEffect, useState } from "react";
import { useMe } from "../../context/me";
import { useVideo } from "../../context/videos";
import VideoTeaser from "../components/VideoTeaser";

const Home = () => {
  const { user } = useMe();
  const { videos } = useVideo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!videos);
  }, [videos]);

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Sit tight! Initial loading may take approximately 40-50 seconds as
              I'm utilizing a free API deployment.
            </p>
          </div>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-lg">
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <VideoTeaser key={video.videoId} video={video} />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center text-lg mt-8">No videos found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
