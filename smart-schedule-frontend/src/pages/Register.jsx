import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import {
  sendEmailOTP,
  verifyOTP,
  registerUser
} from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 SEND OTP
  const handleSendOTP = async () => {
    if (!form.email) return alert("Enter email first");

    try {
      setLoading(true);

      await sendEmailOTP({
        email: form.email.toLowerCase()
      });

      alert("✅ OTP sent");
      setStep(2);

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      setLoading(true);

      await verifyOTP({
        email: form.email.toLowerCase(),
        otp: otp.trim()
      });

      alert("✅ OTP verified");
      setStep(3);

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 REGISTER
  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerUser({
        ...form,
        email: form.email.toLowerCase()
      });

      alert("🎉 Registered Successfully");
      navigate("/");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GOOGLE SIGNUP
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }
      );

      if (res.data.isNewUser === false) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        localStorage.setItem("tempEmail", res.data.email);
        navigate("/verify-otp");
      }

    } catch (err) {
      console.log(err);
      alert("❌ Google signup failed");
    }
  };

  return (
    <div className="blur-bg">
      <div className="register-container">

        <img src="/images/logo.png" alt="logo" className="logo" />
        <h2>Create Account</h2>

        {step === 1 && (
          <>
            <input name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input name="username" placeholder="Username" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

            <button onClick={handleSendOTP} className="register-btn">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleVerifyOTP} className="register-btn">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <button onClick={handleRegister} className="register-btn">
            {loading ? "Creating..." : "Complete Registration"}
          </button>
        )}

        <div className="divider"><span>OR</span></div>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Signup Failed")}
          />
        </div>

        <p onClick={() => navigate("/")} className="link">
          Already have an account? Login
        </p>

      </div>
    </div>
  );
}

export default Register;