import axios from "axios";

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: { crossDomain: true, "Content-Type": "application/json" },
});
