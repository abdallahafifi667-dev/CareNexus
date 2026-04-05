import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Change '/api' if backend prefix differs
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach authentication token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers["auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for global error handling and data normalization
axiosInstance.interceptors.response.use(
  (response) => {
    const normalizeIds = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      if (Array.isArray(obj)) {
        return obj.map(normalizeIds);
      }
      const newObj = { ...obj };
      if (newObj._id && !newObj.id) {
        newObj.id = newObj._id;
      }
      // Also recursively normalize nested objects
      Object.keys(newObj).forEach((key) => {
        newObj[key] = normalizeIds(newObj[key]);
      });
      return newObj;
    };

    if (response.data) {
      response.data = normalizeIds(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "Unauthorized request caught by Axios Interceptor. Logging out...",
      );
      localStorage.removeItem("auth-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("auth-user");
      // Avoid infinite loops if already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
