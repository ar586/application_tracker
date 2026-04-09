import axios from "axios";

const getBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // Auto-detect if running on Vercel production
    if (typeof window !== "undefined" && window.location.hostname.includes("vercel.app")) {
        return "/_/backend/api";
    }

    return "http://localhost:5000/api";
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to attach token implicitly
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
