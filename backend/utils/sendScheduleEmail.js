import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Main function
const sendScheduleEmail = async (to, pdfBuffer) => {
  try {
    const info = await transporter.sendMail({
      from: `"Smart Scheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject: "📅 Your Smart Study Schedule",
      text: "Your AI-generated schedule is attached.",
      attachments: [
        {
          filename: "SmartSchedule.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw error;
  }
};

export default sendScheduleEmail;