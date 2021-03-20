import axios from "axios";

export const searchUser = async (search, token) =>
  await axios.get(`/api/search?s=${search}`, {
    headers: {
      Authorization: token,
    },
  });

export const getUser = async (username) =>
  await axios.get(`/api/user-info/${username}`);

export const updateUser = async (data, id, token) =>
  await axios.patch(`/api/update-user/${id}`, data, {
    headers: {
      Authorization: token,
    },
  });

export const followUser = async (followId, token) =>
  await axios.put(
    "/api/user/follow",
    { followId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const unfollowUser = async (followId, token) =>
  await axios.put(
    "/api/user/unfollow",
    { followId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const savedPost = async (postId, userId, token) =>
  await axios.patch(
    `/api/saved/${userId}`,
    { id: postId },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const unsavedPost = async (postId, userId, token) =>
  await axios.patch(
    `/api/un-saved/${userId}`,
    { id: postId },
    {
      headers: {
        Authorization: token,
      },
    }
  );
