import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   EMAIL SETUP (INLINE)
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   SEND EMAIL FUNCTION
========================= */
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Assignment System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("EMAIL ERROR:", err.message);
  }
};

/* =========================
   GET ALL SUBMISSIONS
========================= */
export const getSubmissions = async (req, res) => {
  try {
    const data = await Submission.find()
      .populate("studentId", "firstName email")
      .populate("assignmentId", "title");

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET BY ASSIGNMENT
========================= */
export const getByAssignment = async (req, res) => {
  try {
    const data = await Submission.find({
      assignmentId: req.params.id,
    })
      .populate("studentId", "firstName email")
      .populate("assignmentId", "title");

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   EVALUATE SUBMISSION
========================= */
export const evaluateSubmission = async (req, res) => {
  try {
    const { submissionId, marks, feedback } = req.body;

    /* =========================
       GRADE CALCULATION
    ========================= */
    let grade = "F";
    if (marks >= 90) grade = "A+";
    else if (marks >= 75) grade = "A";
    else if (marks >= 60) grade = "B";
    else if (marks >= 40) grade = "C";

    /* =========================
       UPDATE SUBMISSION
    ========================= */
    const updated = await Submission.findByIdAndUpdate(
      submissionId,
      {
        marks,
        grade,
        feedback,
        status: "evaluated",
        evaluatedAt: new Date(),
      },
      { new: true }
    ).populate("studentId assignmentId");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    /* =========================
       SAFE DATA EXTRACTION
    ========================= */
    const studentEmail = updated?.studentId?.email;
    const studentName = updated?.studentId?.firstName || "Student";
    const assignmentTitle = updated?.assignmentId?.title || "Assignment";

    /* =========================
       SEND EMAIL
    ========================= */
    if (studentEmail) {
      const subject = "📊 Your Assignment Has Been Evaluated";

      const message = `
Hello ${studentName},

Your assignment "${assignmentTitle}" has been evaluated.

━━━━━━━━━━━━━━━━━━━━━━
📌 Marks: ${marks}/100
🏆 Grade: ${grade}
━━━━━━━━━━━━━━━━━━━━━━

📝 Feedback:
${feedback || "No feedback provided"}

━━━━━━━━━━━━━━━━━━━━━━
Keep improving and keep learning 🚀
      `;

      await sendEmail(studentEmail, subject, message);
    }

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      success: true,
      message: "Evaluation completed & email sent",
      data: updated,
    });

  } catch (err) {
    console.error("Evaluation Error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};