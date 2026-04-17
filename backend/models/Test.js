import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: String,
  description: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],

  duration: Number, // minutes

  schedule: {
    startTime: Date,
    endTime: Date
  },

  settings: {
    shuffleQuestions: { type: Boolean, default: false },
    negativeMarking: { type: Boolean, default: false },
    allowTabSwitch: { type: Boolean, default: false }
  },

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Test", testSchema);