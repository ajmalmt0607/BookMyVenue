export const setTokens = (tokens) => {
  localStorage.setItem(
    "access_token",
    tokens.access
  );

  localStorage.setItem(
    "refresh_token",
    tokens.refresh
  );
};

export const getAccessToken = () =>
  localStorage.getItem(
    "access_token"
  );

export const getRefreshToken = () =>
  localStorage.getItem(
    "refresh_token"
  );

export const updateAccessToken = (
  access
) => {
  localStorage.setItem(
    "access_token",
    access
  );
};

export const clearTokens = () => {
  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "refresh_token"
  );
};