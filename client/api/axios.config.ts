import axios from "axios";
import { API_ENDPOINT } from "../src/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

export default axiosInstance;
