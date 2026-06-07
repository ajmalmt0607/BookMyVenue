import api from "../api/axios";

export const signupUser = async (payload) => {
  const response = await api.post(
    "/accounts/signup/",
    payload
  );

  return response.data;
};

export const verifySignupOtp = async (
  payload
) => {
  const response = await api.post(
    "/accounts/verify-signup-otp/",
    payload
  );

  return response.data;
};

export const loginUser = async (
  payload
) => {
  const response =
    await api.post(
      "/accounts/login/",
      payload
    );

  return response.data;
};