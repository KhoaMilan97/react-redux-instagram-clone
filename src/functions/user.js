import { API } from "../api";

export const searchUser = async (search, token) =>
  await API.get(`/api/search?s=${search}`, {
    headers: {
      Authorization: token,
    },
  });

export const getUser = async (username) =>
  await API.get(`/api/user-info/${username}`);

export const updateUser = async (data, id, token) =>
  await API.patch(`/api/update-user/${id}`, data, {
    headers: {
      Authorization: token,
    },
  });

export const followUser = async (followId, token) =>
  await API.put(
    "/api/user/follow",
    { followId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const unfollowUser = async (followId, token) =>
  await API.put(
    "/api/user/unfollow",
    { followId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const savedPost = async (postId, userId, token) =>
  await API.patch(
    `/api/saved/${userId}`,
    { id: postId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const unsavedPost = async (postId, userId, token) =>
  await API.patch(
    `/api/un-saved/${userId}`,
    { id: postId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const suggestUser = async (userId, token) =>
  await API.get(`/api/suggest-user/${userId}`, {
    headers: {
      Authorization: token,
    },
  });

export const getSavedPosts = async (username, token) =>
  await API.get(`/api/get-saved-post/${username}`, {
    headers: {
      Authorization: token,
    },
  });
