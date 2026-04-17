import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth"
});

// ✅ SEND OTP
export const sendEmailOTP = (data) => API.post("/send-otp", data);

// ✅ VERIFY OTP
export const verifyOTP = (data) => API.post("/verify-otp", data);

// ✅ REGISTER
export const registerUser = (data) => API.post("/register", data);

// ✅ LOGIN
export const loginUser = (data) => API.post("/login", data);

// ✅ FORGOT PASSWORD
export const forgotPassword = (data) => API.post("/forgot-password", data);

// ✅ VERIFY FORGOT OTP
export const verifyForgotOTP = (data) => API.post("/verify-forgot-otp", data);

// ✅ RESET PASSWORD
export const resetPassword = (data) => API.post("/reset-password", data);