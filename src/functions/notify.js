import axios from "axios";
axios.defaults.baseURL = "https://instagram-clone-api-v1.herokuapp.com";

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

export const isReadNotify = async (id, token) =>
  await axios.patch(
    `/api/read-notify/${id}`,
    {},
    {
      headers: { Authorization: token },
    }
  );

export const deleteAllNotify = async (token) =>
  await axios.delete(`/api/delete-all-notify`, {
    headers: { Authorization: token },
  });
