import { API } from "../api";

export const login = async (user) => await API.post(`/api/login`, user);
export const register = async (user) => await API.post(`/api/register`, user);
export const logout = async () => await API.get(`/api/logout`);
export const getAccessToken = async () =>
  await API.post("/api/refresh-token", {});

export const forgotPassword = async (email) =>
  await API.post("/api/forgot-password", { email });

export const resetPassword = async (password, token) =>
  await API.post(
    "/api/reset-password",
    { password },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const checkOldPassword = async (email, password) =>
  await API.post("/api/check-old-password", { email, password });
