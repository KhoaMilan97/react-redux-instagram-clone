import axios from "axios";

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

export const getMessages = async (id, token) =>
  await axios.get(`/api/messages/${id}`, {
    headers: {
      Authorization: token,
    },
  });
