import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosAdmin = axios.create({
  baseURL: API_URL,
  withCredentials: true, // otomatis kirim cookie di setiap request
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Proses antrian request yang tertunda saat refresh selesai
const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Interceptor response — tangkap 401 dan lakukan silent refresh
axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry;

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

    // Jika sedang refresh, antrekan request yang lain
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosAdmin(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosAdmin.post("/auth/refresh");

      processQueue(null);
      return axiosAdmin(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosAdmin;