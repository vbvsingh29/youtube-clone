import { useVideo } from "../../context/videos";
import { useMe } from "../../context/me";
import VideoTeaser from "../components/VideoTeaser";

const MyVideos = () => {
  const { videos } = useVideo();
  const { user } = useMe();

  const myVideos = videos?.filter((v) => String(v.owner) === String(user?._id));

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-zinc-400">
        Please log in to view your videos.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <h1 className="text-3xl font-extrabold mb-6 text-white text-center sm:text-left">
        Your Videos
      </h1>
      
      {myVideos && myVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-lg">
          {myVideos.map((video) => (
            <VideoTeaser key={video.videoId} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg mx-auto mt-8">
          <p className="text-zinc-500 text-lg mb-4">You haven't uploaded any videos yet.</p>
          <p className="text-zinc-600 text-sm">Use the "Upload Video" button in the header to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MyVideos;
