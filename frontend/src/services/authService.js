import axios from "axios";

const API_BASE_URL =
  "http://localhost:8011/api/v1";

export const signupUser = (
  data
) => {
  return axios.post(
    `${API_BASE_URL}/accounts/signup/`,
    data
  );
};