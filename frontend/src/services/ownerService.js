import api from "../api/axios";

export const getOwnerDashboard = async () => {
  const response = await api.get("/owner/dashboard/");

  return response.data;
};
