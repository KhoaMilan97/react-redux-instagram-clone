import axios from "axios";

export const createPost = async (data, token) =>
  await axios.post(`/api/create-post`, data, {
    headers: { Authorization: token },
  });

export const getPosts = async (userid, token) =>
  await axios.get(`/api/posts/${userid}`, {
    headers: { Authorization: token },
  });

export const getSinglePost = async (id, token) =>
  await axios.get(`/api/post/${id}`, {
    headers: { Authorization: token },
  });

export const getFollowerPost = async (id, token) =>
  await axios.get(`/api/follower-post/${id}`, {
    headers: { Authorization: token },
  });
