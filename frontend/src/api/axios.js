import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../utils/tokenStorage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,

  timeout: 10000,

  headers: {
    "Content-Type":
      "application/json",
  },
});

/* Request */

api.interceptors.request.use(
  (config) => {

    const token =
      getAccessToken();

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) =>
    Promise.reject(error)
);

let refreshPromise = null;

const refreshTokens = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/accounts/token/refresh/`,
    { refresh }
  );

  setTokens({
    access: response.data.access,
    refresh: response.data.refresh,
  });

  return response.data.access;
};

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise =
        refreshPromise ||
        refreshTokens().finally(() => {
          refreshPromise = null;
        });

      const newAccess = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;

      return api(originalRequest);
    } catch {
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(error);
    }

  }
);

export default api;