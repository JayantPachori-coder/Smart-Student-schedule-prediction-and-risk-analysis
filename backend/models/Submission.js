import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentName: String,

    /* =========================
       FILE INFO (UPGRADED)
    ========================= */
    file: {
      type: String, // stored path: uploads/abc.pdf
      default: ""
    },

    fileName: {
      type: String // original name
    },

    fileType: {
      type: String // pdf, docx, png etc
    },

    fileSize: {
      type: Number // bytes
    },

    /* =========================
       ANSWERS
    ========================= */
    textAnswer: {
      type: String,
      default: ""
    },

    /* =========================
       STATUS
    ========================= */
    status: {
      type: String,
      enum: ["submitted", "evaluated"],
      default: "submitted"
    },

    /* =========================
       EVALUATION
    ========================= */
    marks: {
      type: Number,
      default: 0
    },

    grade: {
      type: String,
      default: ""
    },

    feedback: {
      type: String,
      default: ""
    },

    evaluatedAt: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Submission", submissionSchema);