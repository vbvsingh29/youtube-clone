import axiosInstance from "./axios.config";

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

export function getMe() {
  return axiosInstance
    .get(userBase, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch(() => {
      return null;
    });
}

export function uploadVideo({
  formData,
  config,
}: {
  formData: FormData;
  config: { onUploadProgress: (progressEvent: any) => void };
}) {
  return axiosInstance
    .post(videoBase, formData, {
      withCredentials: true,
      ...config,
      onUploadProgress: config.onUploadProgress,
    })
    .then((res) => res.data);
}

export function updateVideo({
  videoId,
  ...payload
}: {
  videoId: string;
  title: string;
  description: string;
  published: boolean;
}) {
  return axiosInstance.patch(`${videoBase}/${videoId}`, payload, {
    withCredentials: true,
  });
}

export function getVideos() {
  return axiosInstance.get(videoBase).then((res) => res.data);
}
