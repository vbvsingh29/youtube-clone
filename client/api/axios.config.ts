import axios from "axios";
import { API_ENDPOINT } from "../src/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
});

export default axiosInstance;
