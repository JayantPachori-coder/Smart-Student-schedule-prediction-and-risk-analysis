import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["mcq", "descriptive"],
    required: true
  },

  question: String,

  options: [String], // MCQ only

  correctAnswer: mongoose.Schema.Types.Mixed,

  marks: { type: Number, default: 1 },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  }
});

export default mongoose.model("Question", questionSchema);