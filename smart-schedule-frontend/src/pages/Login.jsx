import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/home");

    } catch (err) {
      console.log(err);

      if (err.response?.data?.msg === "Please verify your email before login") {
        alert("⚠️ Please verify your email first");
      } else {
        alert(err.response?.data?.msg || "Login failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="blur-bg">
      <div className="login-container">

        <img src="/images/logo.png" alt="logo" className="logo" />
        <h2>Student Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button type="submit" className="login-btn">
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* ✅ Removed Google Login */}

          <p onClick={() => navigate("/forgot-password")} className="link">
            Forgot Password?
          </p>

          <p onClick={() => navigate("/register")} className="link">
            New User? Register
          </p>
        </form>

      </div>
    </div>
  );
}

export default Login;
