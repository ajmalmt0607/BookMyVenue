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

/* Response */

// Shared across all requests so concurrent 401s (e.g. a page firing
// several calls in parallel via Promise.all) don't each fire their own
// refresh. The backend rotates + blacklists the refresh token on every
// use, so a second refresh call started before the first resolves
// would always be rejected (its token already blacklisted by the
// first) - forcing a logout even though the session was still valid.
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

  // ROTATE_REFRESH_TOKENS is on, so every refresh response carries a
  // new refresh token and blacklists the one just used - persisting
  // only the access token left the now-blacklisted refresh token in
  // storage, so the very next silent refresh always failed.
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