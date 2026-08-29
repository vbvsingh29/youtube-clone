import { useState } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINT } from "../utils/constants";
import { Video } from "../../types";
import { Trash2, Play, RefreshCw } from "lucide-react";
import axiosInstance from "../../api/axios.config";
import { toast } from "react-toastify";

const Admin = () => {
  const [secret, setSecret] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllVideos = async (secretKey: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_ENDPOINT}/api/videos?adminSecret=${secretKey}`);
      setVideos(response.data);
      setIsAuthorized(true);
    } catch (err: any) {
      toast.error("Failed to fetch videos. Invalid Admin Secret?");
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) return;
    fetchAllVideos(secret);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`${API_ENDPOINT}/api/videos/${videoId}?adminSecret=${secret}`);
      toast.success("Video deleted successfully");
      setVideos((prev) => prev.filter((v) => v.videoId !== videoId));
    } catch (err: any) {
      toast.error("Failed to delete video: " + (err.response?.data || err.message));
    }
  };

  const handleBulkCleanup = async () => {
    if (!window.confirm("WARNING: Are you sure you want to delete ALL videos and clean the storage directory? This is permanent.")) return;
    try {
      await axiosInstance.delete(`${API_ENDPOINT}/api/videos?adminSecret=${secret}`);
      toast.success("All videos deleted successfully");
      setVideos([]);
    } catch (err: any) {
      toast.error("Bulk cleanup failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl mt-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl text-zinc-100">
        <h1 className="text-3xl font-extrabold mb-6 text-white text-center sm:text-left">
          Admin Moderation Portal
        </h1>

        {!isAuthorized ? (
          <form onSubmit={handleAuthorize} className="max-w-md mx-auto py-8">
            <p className="text-zinc-400 text-sm text-center mb-4">
              Please enter the Admin Secret Key to access the video directory and moderation tools.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Enter Admin Secret..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition disabled:bg-zinc-700"
              >
                {loading ? "Authorizing..." : "Authorize Portal"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b border-zinc-800 pb-4">
              <div className="text-zinc-300 text-sm">
                Authorized Access | Showing <span className="font-bold text-white">{videos.length}</span> videos
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchAllVideos(secret)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition"
                >
                  <RefreshCw size={16} /> Refresh
                </button>
                <button
                  onClick={handleBulkCleanup}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-lg text-sm font-bold transition shadow-md"
                >
                  <Trash2 size={16} /> Bulk Cleanup
                </button>
              </div>
            </div>

            {videos.length === 0 ? (
              <p className="text-center text-zinc-500 py-12">No videos found in directory.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-zinc-300">
                  <thead className="text-xs uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-850">
                    <tr>
                      <th className="px-4 py-3">Thumbnail</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Video ID</th>
                      <th className="px-4 py-3">Published</th>
                      <th className="px-4 py-3">Owner ID</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {videos.map((video) => (
                      <tr key={video.videoId} className="hover:bg-zinc-850/50">
                        <td className="px-4 py-3">
                          <img
                            src={`${API_ENDPOINT}/api/videos/${video.videoId}/thumbnail`}
                            alt={video.title}
                            className="w-20 aspect-video object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-white max-w-xs truncate">
                          {video.title || <em className="text-zinc-500">Unpublished draft</em>}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono">{video.videoId}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              video.published
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-zinc-700/50 text-zinc-400 border border-zinc-600/20"
                            }`}
                          >
                            {video.published ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono truncate max-w-xs">{video.owner}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/watch/${video.videoId}`}
                              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition"
                              title="Watch Video"
                            >
                              <Play size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteVideo(video.videoId)}
                              className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 hover:text-red-300 rounded transition"
                              title="Delete Video"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
