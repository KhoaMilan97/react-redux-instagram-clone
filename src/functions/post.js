import { API } from "../api";

export const createPost = async (data, token) =>
  await API.post(`/api/create-post`, data, {
    headers: { Authorization: token },
  });

export const getPosts = async (userid, page, token) =>
  await API.get(`/api/posts/${userid}/?page=${page}`, {
    headers: { Authorization: token },
  });

export const getSinglePost = async (id, token) =>
  await API.get(`/api/post/${id}`, {
    headers: { Authorization: token },
  });

export const getFollowerPost = async (id, page, token) =>
  await API.get(`/api/follower-post/${id}?page=${page}`, {
    headers: { Authorization: token },
  });

export const removePosts = async (id, token) =>
  await API.delete(`/api/post/${id}`, {
    headers: { Authorization: token },
  });

export const updatePost = async (data, id, token) =>
  await API.patch(`/api/post/${id}`, data, {
    headers: { Authorization: token },
  });

export const likePost = async (data, id, token) =>
  await API.patch(`/api/like/${id}`, data, {
    headers: { Authorization: token },
  });

export const unLikePost = async (data, id, token) =>
  await API.patch(`/api/unlike/${id}`, data, {
    headers: { Authorization: token },
  });

export const getExplorePost = async (id, page, token) =>
  await API.get(`/api/explore/${id}?page=${page}`, {
    headers: { Authorization: token },
  });
