import axios from "axios";

export const createNotify = async (data, token) =>
  await axios.post(`/api/create-notify`, data, {
    headers: { Authorization: token },
  });

export const removeNotify = async (data, token) =>
  await axios.delete(`/api/remove-notify/${data.id}?url=${data.url}`, {
    headers: { Authorization: token },
  });

export const getNotify = async (token) =>
  await axios.get(`/api/notifies`, {
    headers: { Authorization: token },
  });
