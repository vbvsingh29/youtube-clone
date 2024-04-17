import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Video } from "../types";
import { getVideos } from "../api";

const VideoContext = createContext<Video[] | null>(null);

function VideoContextProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    }
    fetchVideos();
  }, []);

  return (
    <VideoContext.Provider value={videos}>{children}</VideoContext.Provider>
  );
}

const useVideo = () => useContext(VideoContext);

export { useVideo, VideoContextProvider };