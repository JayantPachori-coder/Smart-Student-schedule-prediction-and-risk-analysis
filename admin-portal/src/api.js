import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-backend-2zlf.onrender.com",
  timeout: 10000,
});

export default api;
