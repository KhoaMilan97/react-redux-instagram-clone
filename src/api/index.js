import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: { crossDomain: true, "Content-Type": "application/json" },
});