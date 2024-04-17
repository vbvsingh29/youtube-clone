import axios from 'axios';
import "dotenv/config";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export default axiosInstance;