import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Video } from "../types";
import { getVideos } from "../api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface VideoContextType {
  videos: Video[] | null;
  refetchVideos: (query?: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType>({
  videos: null,
  refetchVideos: async () => {},
});

function VideoContextProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const token = useSelector((state: RootState) => state.token.token);

  async function refetchVideos(query?: string) {
    try {
      const fetchedVideos = await getVideos(query, token);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }

  useEffect(() => {
    refetchVideos();
  }, [token]);

  return (
    <VideoContext.Provider value={{ videos, refetchVideos }}>
      {children}
    </VideoContext.Provider>
  );
}

const useVideo = () => useContext(VideoContext);

export { useVideo, VideoContextProvider };