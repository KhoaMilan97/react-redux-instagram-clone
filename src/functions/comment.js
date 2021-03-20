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

export const getPostComments = async (id, page, limit, token) =>
  await axios.get(`/api/comments/${id}?page=${page}&limit=${limit}`, {
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

export const replyComment = async (data, token) =>
  await axios.post(`/api/reply-comment`, data, {
    headers: { Authorization: token },
  });

export const deleteComment = async (id, token) =>
  await axios.delete(`/api/del-comment/${id}`, {
    headers: { Authorization: token },
  });

export const deleteReplyComment = async (id, repid, token) =>
  await axios.patch(
    `/api/del-reply-comment/${id}`,
    { repid },
    {
      headers: { Authorization: token },
    }
  );
