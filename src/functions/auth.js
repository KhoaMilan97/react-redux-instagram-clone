import axios from "axios";

axios.defaults.baseURL = "https://instagram-clone-api-v1.herokuapp.com";

export const login = async (user) => await axios.post(`/api/login`, user);
export const register = async (user) => await axios.post(`/api/register`, user);
export const logout = async () => await axios.get(`/api/logout`);
export const getAccessToken = async () =>
  await axios.post("/api/refresh-token", {});

export const forgotPassword = async (email) =>
  await axios.post("/api/forgot-password", { email });

export const resetPassword = async (password, token) =>
  await axios.post(
    "/api/reset-password",
    { password },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const checkOldPassword = async (email, password) =>
  await axios.post("/api/check-old-password", { email, password });
