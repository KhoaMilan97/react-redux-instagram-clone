import { API } from "../api";

export const createMessage = async (data, token) =>
  await API.post("/api/message", data, {
    headers: {
      Authorization: token,
    },
  });

export const getConservations = async (token) =>
  await API.get("/api/convervations", {
    headers: {
      Authorization: token,
    },
  });

export const getMessages = async (id, token, page) => {
  return await API.get(`/api/messages/${id}?limit=${page * 9}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteMessages = async (id, token) => {
  return await API.delete(`/api/messages/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteConservation = async (id, token) => {
  return await API.delete(`/api/convervations/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};
