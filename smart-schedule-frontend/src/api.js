import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-url.onrender.com/api",
});

export default api;
