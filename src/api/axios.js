// src/api/axios.js
import { auth } from "@/lib/firebase";
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND, // your Express backend
  withCredentials: false, // set to true only if you use cookies
});

// Interceptor: add Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const idToken = await currentUser.getIdToken(); // auto-refreshes if expired
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});

export default api;
