import axios from "axios";

export const createPost = async (data, token) =>
  await axios.post(`/api/create-post`, data, {
    headers: { Authorization: token },
  });

export const getPosts = async (userid, page, token) =>
  await axios.get(`/api/posts/${userid}/?page=${page}`, {
    headers: { Authorization: token },
  });

export const getSinglePost = async (id, token) =>
  await axios.get(`/api/post/${id}`, {
    headers: { Authorization: token },
  });

export const getFollowerPost = async (id, page, token) =>
  await axios.get(`/api/follower-post/${id}?page=${page}`, {
    headers: { Authorization: token },
  });

export const removePosts = async (id, token) =>
  await axios.delete(`/api/post/${id}`, {
    headers: { Authorization: token },
  });

export const updatePost = async (data, id, token) =>
  await axios.patch(`/api/post/${id}`, data, {
    headers: { Authorization: token },
  });

export const likePost = async (data, id, token) =>
  await axios.patch(`/api/like/${id}`, data, {
    headers: { Authorization: token },
  });

export const unLikePost = async (data, id, token) =>
  await axios.patch(`/api/unlike/${id}`, data, {
    headers: { Authorization: token },
  });
