import { API } from "../api";

export const createNotify = async (data, token) =>
  await API.post(`/api/create-notify`, data, {
    headers: { Authorization: token },
  });

export const removeNotify = async (data, token) =>
  await API.delete(`/api/remove-notify/${data.id}?url=${data.url}`, {
    headers: { Authorization: token },
  });

export const getNotify = async (token) =>
  await API.get(`/api/notifies`, {
    headers: { Authorization: token },
  });

export const isReadNotify = async (id, token) =>
  await API.patch(
    `/api/read-notify/${id}`,
    {},
    {
      headers: { Authorization: token },
    }
  );

export const deleteAllNotify = async (token) =>
  await API.delete(`/api/delete-all-notify`, {
    headers: { Authorization: token },
  });
