import axios from "axios";

axios.defaults.baseURL = "https://instagram-clone-api-v1.herokuapp.com";

export const createComment = async (data, token) =>
  await axios.post(`/api/create-comment`, data, {
    headers: { Authorization: token },
  });

export const updateComment = async (id, content, token) =>
  await axios.patch(`/api/update-comment/${id}`, content, {
    headers: { Authorization: token },
  });

export const likeComment = async (id, data, token) =>
  await axios.post(`/api/like-comment/${id}`, data, {
    headers: { Authorization: token },
  });

export const unLikeComment = async (id, data, token) =>
  await axios.post(`/api/unlike-comment/${id}`, data, {
    headers: { Authorization: token },
  });

export const deleteComment = async (id, token) =>
  await axios.delete(`/api/del-comment/${id}`, {
    headers: { Authorization: token },
  });
