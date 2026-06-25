import axios from "axios";

import {
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
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

/* Response */

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry =
        true;

      try {

        const refresh =
          getRefreshToken();

        if (!refresh) {

          clearTokens();

          window.location.href =
            "/login";

          return Promise.reject(
            error
          );

        }

        const response =
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/accounts/token/refresh/`,
            {
              refresh,
            }
          );

        const newAccess =
          response.data.access;

        updateAccessToken(
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(
          originalRequest
        );

      } catch {

        clearTokens();

        window.location.href =
          "/login";

      }

    }

    return Promise.reject(
      error
    );

  }
);

export default api;