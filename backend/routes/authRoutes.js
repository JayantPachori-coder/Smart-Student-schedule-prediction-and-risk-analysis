import express from "express";
import {
  sendOTP,
  verifyOTP,
  register,
  login,
  forgotPassword,
  verifyForgotOTP,
  resetPassword,
  getUsers,
  googleLogin
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

router.post("/register", register);
router.post("/login", login);

router.post("/google", googleLogin); // ⭐ NEW GOOGLE LOGIN ROUTE

router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);

router.get("/users", getUsers);

export default router;