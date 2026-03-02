import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // json-server
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("persist:root")
      ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).auth)?.token
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;