import axios from "axios";
axios.defaults.baseURL = "https://instagram-clone-api-v1.herokuapp.com";

export const createMessage = async (data, token) =>
  await axios.post("/api/message", data, {
    headers: {
      Authorization: token,
    },
  });

export const getConservations = async (token) =>
  await axios.get("/api/convervations", {
    headers: {
      Authorization: token,
    },
  });

export const getMessages = async (id, token, page) => {
  return await axios.get(`/api/messages/${id}?limit=${page * 9}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteMessages = async (id, token) => {
  return await axios.delete(`/api/messages/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};

export const deleteConservation = async (id, token) => {
  return await axios.delete(`/api/convervations/${id}`, {
    headers: {
      Authorization: token,
    },
  });
};
