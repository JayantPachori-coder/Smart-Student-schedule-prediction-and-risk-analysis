import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   TRANSPORTER CONFIG
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,        // ✅ correct
    pass: process.env.EMAIL_PASS,   // ✅ App Password only
  },
});

/* =========================
   VERIFY CONNECTION (OPTIONAL DEBUG)
========================= */
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email server error:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

/* =========================
   MAIN EMAIL FUNCTION
========================= */
export const sendRiskEmail = async (to, riskLevel, confidence) => {
  try {
    if (!to) throw new Error("Recipient email is missing");

    // Convert confidence to percentage
    const formattedConfidence = (Number(confidence) * 100).toFixed(2);

    let subject = "";
    let message = "";

    /* =========================
       RISK LOGIC
    ========================= */

    if (riskLevel === "Low Risk") {
      subject = "🟢 Academic Status: SAFE";
      message = `
Great work! 🎉

Your academic performance is stable.

Risk Level: LOW 🟢
Confidence: ${formattedConfidence}%

Keep maintaining consistency.
      `;
    }

    else if (riskLevel === "Medium Risk") {
      subject = "🟡 Academic Warning Alert";
      message = `
⚠️ Attention Required

You are in MODERATE risk zone.

Risk Level: MEDIUM 🟡
Confidence: ${formattedConfidence}%

Suggestions:
- Improve study consistency
- Reduce backlog
- Revise weekly
      `;
    }

    else {
      subject = "🔴 CRITICAL Academic Alert";
      message = `
🚨 URGENT ACTION REQUIRED 🚨

You are in HIGH RISK zone.

Risk Level: HIGH 🔴
Confidence: ${formattedConfidence}%

Immediate Actions:
- Study 4+ hours daily
- Focus only on weak subjects
- Seek mentor help
- Follow strict schedule
      `;
    }

    /* =========================
       SEND EMAIL
    ========================= */
    const result = await transporter.sendMail({
      from: `"AI Smart Student System" <${process.env.EMAIL}>`,
      to,
      subject,
      text: message,
    });

    console.log("📧 Email sent successfully:", result.messageId);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("❌ Email failed:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendRiskEmail;