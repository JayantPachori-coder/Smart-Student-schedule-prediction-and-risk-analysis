import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-backend-2zlf.onrender.com",
});

export default api;
