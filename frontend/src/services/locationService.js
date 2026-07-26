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

export const reverseGeocode = async (lat, lng) => {
  const response = await api.get("/venues/locations/reverse/", {
    params: { lat, lng },
  });

  return response.data;
};
