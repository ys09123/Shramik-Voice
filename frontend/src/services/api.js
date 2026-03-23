import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes("/auth")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getAllGrievances: () => api.get("/admin/grievances"),
  getAllUsers: () => api.get("/admin/users"),
  updateStatus: (id, status) =>
    api.patch(`/admin/grievances/${id}/status`, { status }),
};

export const grievanceAPI = {
  createGrievance: (data) => api.post("/grievances", data),
  getMyGrievances: () => api.get("/grievances/mine"),
};
