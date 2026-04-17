import mongoose from "mongoose";

const shapSchema = new mongoose.Schema(
  {
    userId: String,

    riskLevel: String,
    confidence: Number,

    shapValues: Object,
    inputData: Object,

    insights: [String],
    recommendations: [String]
  },
  { timestamps: true }
);

export default mongoose.model("ShapDashboard", shapSchema);