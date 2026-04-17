import mongoose from "mongoose";

const emailAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    riskLevel: {
      type: String,
      enum: ["Low Risk", "Medium Risk", "High Risk"],
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["SENT", "FAILED"],
      default: "SENT",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailAlert", emailAlertSchema);