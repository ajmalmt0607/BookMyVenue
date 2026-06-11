import api from "../api/axios";

export const getVenues = async (params = {}) => {
  const response = await api.get(
    "/venues/venues/",
    {
      params,
    }
  );

  return response.data;
};