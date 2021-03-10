import axios from "axios";

export const createComment = async (data, token) =>
  await axios.post(`/api/create-comment`, data, {
    headers: { Authorization: token },
  });

export const getComment = async (id, token) =>
  await axios.get(`/api/comment/${id}`, {
    headers: { Authorization: token },
  });

export const getCommentCount = async (id, token) =>
  await axios.get(`/api/comment-count/${id}`, {
    headers: { Authorization: token },
  });

export const getPostComments = async (id, page, token) =>
  await axios.get(`/api/comments/${id}?page=${page}`, {
    headers: { Authorization: token },
  });
