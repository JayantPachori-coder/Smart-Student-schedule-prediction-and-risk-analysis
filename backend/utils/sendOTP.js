import nodemailer from "nodemailer";

// TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEND OTP FUNCTION
export const sendOTP = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing email credentials in .env");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family:Arial;padding:10px">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#4F46E5">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP sent successfully to:", email);

  } catch (err) {
    console.error("❌ Email OTP Error:", err.message);
    throw err; // IMPORTANT so backend catches 500 properly
  }
};