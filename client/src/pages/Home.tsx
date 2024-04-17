import { Link } from "react-router-dom";
import { useMe } from "../../context/me";
import { Anchor } from "lucide-react";
import { useVideo } from "../../context/videos";
import VideoTeaser from "../components/VideoTeaser";

const Home = () => {
  const { user } = useMe();
  const videos = useVideo();
  console.log(videos, "videos");

  return (
    <div className="text-3xl font-bold underline">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos &&
          videos.map((video) => (
            <VideoTeaser key={video.videoId} video={video} />
          ))}
      </div>
    </div>
  );
};

export default Home;
