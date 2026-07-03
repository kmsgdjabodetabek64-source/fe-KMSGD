import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosPublic = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Keamanan: jangan kirim Authorization ke domain eksternal
axiosPublic.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("http") && !config.url.startsWith(API_URL ?? "")) {
    delete config.headers["Authorization"];
  }
  return config;
});

export default axiosPublic;
