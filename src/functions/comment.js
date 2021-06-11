import { API } from "../api";

export const createComment = async (data, token) =>
  await API.post(`/api/create-comment`, data, {
    headers: { Authorization: token },
  });

export const updateComment = async (id, content, token) =>
  await API.patch(`/api/update-comment/${id}`, content, {
    headers: { Authorization: token },
  });

export const likeComment = async (id, data, token) =>
  await API.post(`/api/like-comment/${id}`, data, {
    headers: { Authorization: token },
  });

export const unLikeComment = async (id, data, token) =>
  await API.post(`/api/unlike-comment/${id}`, data, {
    headers: { Authorization: token },
  });

export const deleteComment = async (id, token) =>
  await API.delete(`/api/del-comment/${id}`, {
    headers: { Authorization: token },
  });
