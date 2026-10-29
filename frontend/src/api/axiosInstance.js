import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("isp_user") || "null");
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {
    localStorage.removeItem("isp_user");
  }
  return config;
});

export default api;
