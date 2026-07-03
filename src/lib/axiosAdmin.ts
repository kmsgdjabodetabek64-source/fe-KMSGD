import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosPublicAuth = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const axiosAdmin = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

let onForceLogout: (() => void) | null = null;

export const setForceLogoutHandler = (handler: () => void) => {
  onForceLogout = handler;
};

const forceLogout = () => {
  if (onForceLogout) {
    onForceLogout();
  }
};

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosAdmin.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const responseData = error.response?.data as { code?: string } | undefined;
    const isTokenExpired =
      error.response?.status === 401 &&
      responseData?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry;

    if (!isTokenExpired) {
      return Promise.reject(error);
    }

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
      await axiosPublicAuth.post("/auth/refresh");
      processQueue(null);
      return axiosAdmin(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosAdmin;
