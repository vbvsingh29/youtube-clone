import { AxiosResponse } from "axios";
import axiosInstance from "./axios.config";
import { Video } from "../types";

const userBase = "/api/users";
const authBase = "/api/auth";
const videoBase = "/api/videos";

export function registerUser(payload: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  return axiosInstance.post(userBase, payload).then((res) => res.data);
}

export function login(payload: { email: string; password: string }) {
  return axiosInstance
    .post(authBase, payload, { withCredentials: true })
    .then((res) => res.data);
}

export function getMe(token: string | null) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axiosInstance
    .get(userBase, { withCredentials: true, headers })
    .then((res) => res.data)
    .catch(() => null);
}

export function uploadVideo({
  formData,
  config,
  token,
}: {
  formData: FormData;
  config: { onUploadProgress: (progressEvent: any) => void };
  token: string | null;
}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axiosInstance
    .post(videoBase, formData, {
      withCredentials: true,
      ...config,
      onUploadProgress: config.onUploadProgress,
      headers,
    })
    .then((res) => res.data);
}

export function updateVideo({
  videoId,
  title,
  description,
  published,
  thumbnail,
  sourceCode,
  token,
}: {
  videoId: string;
  title: string;
  description: string;
  published: boolean;
  thumbnail?: File;
  sourceCode?: string;
  token: string | null;
}): Promise<AxiosResponse<Video>> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("sourceCode", sourceCode);
  formData.append("published", published.toString());
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return axiosInstance.patch(`${videoBase}/${videoId}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
  });
}

export function getVideos() {
  return axiosInstance.get(videoBase).then((res) => res.data);
}
