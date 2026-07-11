import api from "../api/axios";

export const searchLocations = async (query) => {
  if (!query) {
    return [];
  }

  const response = await api.get("/venues/locations/search/", {
    params: { query },
  });

  return response.data;
};
