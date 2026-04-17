import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔥 AUTO ADD TOKEN FOR ALL REQUESTS
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const generateSchedule = (data) => {
  return API.post("/schedule/predict", data);
};

export const getSchedules = () => {
  return API.get("/schedule/history");
};