import axios from "axios";

export const BASE_URL = "http://localhost:5000";

export const IMG_URL = BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminUser");
    }

    return Promise.reject(error);
  }
);

export default API;