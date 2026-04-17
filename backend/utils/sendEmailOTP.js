import nodemailer from "nodemailer";

export const sendEmailOTP = async (email, otp) => {
  try {
    console.log("EMAIL USER:", process.env.EMAIL_USER);
    console.log("PASS EXISTS:", !!process.env.EMAIL_PASS);
    console.log("Sending OTP to:", email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // ✅ FIXED
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    console.log("✅ OTP EMAIL SENT SUCCESSFULLY");

  } catch (err) {
    console.error("❌ EMAIL OTP ERROR:", err.message);
    throw err;
  }
};

export default sendEmailOTP;