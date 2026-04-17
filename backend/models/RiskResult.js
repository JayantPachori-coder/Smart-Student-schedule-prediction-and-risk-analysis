import mongoose from "mongoose";

const riskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inputData: {
      type: Object,
      required: true,
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

    shapValues: {
      type: Object,
      default: {},
    },

    insights: {
      type: [String],
      default: [],
    },

    recommendations: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("RiskResult", riskSchema);