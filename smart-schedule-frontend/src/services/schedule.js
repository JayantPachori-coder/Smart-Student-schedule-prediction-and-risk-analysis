import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-backend-2zlf.onrender.com/api"
});

// 🔥 AUTO ADD TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 📌 Generate schedule
export const generateSchedule = (data) => {
  return API.post("/schedule/predict", data);
};

// 📌 Get history
export const getSchedules = () => {
  return API.get("/schedule/history");
};
