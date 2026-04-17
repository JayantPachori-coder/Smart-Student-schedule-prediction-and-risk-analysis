import React, { useState } from "react";
import "./Login.css";

function ForgotPassword() {

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    email: "",
    phone: "",
    otp: "",
    newPassword: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔹 STEP 1: Send OTP
  const sendOTP = async () => {
    console.log("Send OTP", data);
    setStep(2);
  };

  // 🔹 STEP 2: Verify OTP
  const verifyOTP = async () => {
    console.log("Verify OTP", data);
    setStep(3);
  };

  // 🔹 STEP 3: Reset Password
  const resetPassword = async () => {
    console.log("Reset Password", data);
    alert("Password updated!");
  };

  return (
    <div className="blur-bg">
      <div className="login-container">

        <h2>Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Enter Phone"
              onChange={handleChange}
            />

            <button onClick={sendOTP}>Send OTP</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              onChange={handleChange}
            />

            <button onClick={verifyOTP}>Verify OTP</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
            />

            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;