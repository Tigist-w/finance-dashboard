// src/api.js
import axios from "axios";

// Use the environment variable VITE_API_URL set in Vercel
const BASE = import.meta.env.VITE_API_URL;

if (!BASE) {
  console.error(
    "VITE_API_URL is undefined! Please set it in Vercel Environment Variables."
  );
}

const api = axios.create({
  baseURL: BASE,
  withCredentials: true, // required for cookies/auth
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Retry only once
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Use the same axios instance to preserve credentials
        const r = await api.post("/auth/refresh", {});
        const newToken = r.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); // retry the original request
      } catch (e) {
        // If refresh fails, log out
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
