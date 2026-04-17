import User from "../models/User.js";
import Otp from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailOTP from "../utils/sendEmailOTP.js";
import sendPhoneOTP from "../utils/sendPhoneOTP.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: "Google token missing" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload.email) {
      return res.status(401).json({ msg: "Invalid Google token" });
    }

    // Check existing user
    let user = await User.findOne({ email: payload.email });

    // If not exists → create user
    if (!user) {
      user = await User.create({
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email.toLowerCase(),
        username: payload.email.split("@")[0],
        googleId: payload.sub,
        password: null, // important
        isEmailVerified: true,
        role: "student"
      });
    }

    // Create JWT (same as normal login)
    const tokenJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      msg: "Google login successful",
      token: tokenJwt,
      user
    });

  } catch (err) {
    console.error("Google Login Error:", err);

    return res.status(500).json({
      msg: "Google login failed",
      error: err.message
    });
  }
};

/* =========================
   GET USERS
========================= */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};

/* =========================
   SEND OTP (REGISTER / FORGOT)
========================= */
export const sendOTP = async (req, res) => {
  try {
    let { email, phone } = req.body;

    if (email) email = email.toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({
      $or: [{ email }, { phone }]
    });

    await Otp.create({
      email,
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60000)
    });

    if (email) await sendEmailOTP(email, otp);
    if (phone) await sendPhoneOTP(phone, otp);

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error sending OTP" });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.toLowerCase();

    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ msg: "OTP not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    await Otp.deleteMany({ email });

    res.json({ msg: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed" });
  }
};

/* =========================
   REGISTER USER
========================= */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password
    } = req.body;

    const exists = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword,
      isEmailVerified: true,
      isPhoneVerified: true
    });

    res.json({
      msg: "User registered successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
};

/* =========================
   LOGIN USER
========================= */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user
    });

  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60000)
    });

    await sendEmailOTP(email, otp);

    res.json({ msg: "Reset OTP sent" });

  } catch (err) {
    res.status(500).json({ msg: "Error sending OTP" });
  }
};

/* =========================
   VERIFY FORGOT OTP
========================= */
export const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    res.json({ msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ msg: "Verification failed" });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { password: hashed }
    );

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: "Reset failed" });
  }
};