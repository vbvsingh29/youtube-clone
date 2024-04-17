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
      {videos &&
        videos.map((video) => (
          <VideoTeaser key={video.videoId} video={video} />
        ))}
    </div>
  );
};

export default Home;
