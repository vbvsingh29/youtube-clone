import { useParams } from "react-router-dom";

const WatchVideo = () => {
  const { query } = useParams();

  return (
    <div>
      <video
        className="h-full w-full rounded-lg"
        src={`${process.env.REACT_APP_API_ENDPOINT}/api/videos/${query}`}
        width="800-px"
        height="auto"
        controls
        autoPlay
        id="video-player"
      ></video>
    </div>
  );
};

export default WatchVideo;
