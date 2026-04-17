import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  timeBlock: String,
  hours: Number
});

const subjectSchema = new mongoose.Schema({
  name: String,
  predictedHours: Number,
  blockHours: [blockSchema]
});

const scheduleSchema = new mongoose.Schema({
  userId: String,
  subjects: [subjectSchema]
}, { timestamps: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;