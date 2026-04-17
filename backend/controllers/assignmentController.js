import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import sendEmail from "../utils/mail.js";
import User from "../models/User.js";

/* =========================
   CREATE ASSIGNMENT
========================= */
export const createAssignment = async (req, res) => {
  try {
    let {
      title,
      description,
      deadline,
      teacherId,
      teacherEmail,
      assignedTo,
    } = req.body;

    console.log("CREATE BODY:", req.body);

    // ✅ ensure array
    if (!Array.isArray(assignedTo)) {
      assignedTo = assignedTo ? [assignedTo] : [];
    }

    // ❌ validation
    if (!title || !description || !deadline || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      deadline,
      teacherId,
      assignedTo,
      submissions: [],
      status: "pending",
    });

    // fetch students
    const students = await User.find({
      _id: { $in: assignedTo },
    });

    const emails = students
      .filter((s) => s.email)
      .map((s) =>
        sendEmail(
          s.email,
          "📌 New Assignment",
          `Hello ${s.firstName || s.username},

Title: ${title}
Deadline: ${deadline}`
        )
      );

    if (teacherEmail) {
      emails.push(
        sendEmail(
          teacherEmail,
          "Assignment Created",
          `Assignment "${title}" created successfully.`
        )
      );
    }

    await Promise.allSettled(emails);

    return res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   GET ASSIGNMENTS
========================= */
export const getAssignments = async (req, res) => {
  try {
    const { teacherId, studentId } = req.query;

    let filter = {};

    if (teacherId) filter.teacherId = teacherId;
    if (studentId) filter.assignedTo = studentId;

    const assignments = await Assignment.find(filter)
      .populate("submissions")
      .sort({ createdAt: -1 });

    const data = assignments.map((a) => {
      let status = "active";

      if (a.deadline && new Date(a.deadline) < new Date()) {
        status = "closed";
      }

      return {
        ...a._doc,
        status,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   UPDATE ASSIGNMENT
========================= */
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;

    if (updateData.assignedTo && !Array.isArray(updateData.assignedTo)) {
      updateData.assignedTo = [updateData.assignedTo];
    }

    const updated = await Assignment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   DELETE ASSIGNMENT
========================= */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Assignment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    await Submission.deleteMany({ assignmentId: id });

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/* =========================
   SUBMIT ASSIGNMENT
========================= */
export const submitAssignment = async (req, res) => {
  try {
    const {
      assignmentId,
      studentId,
      studentName,
      studentEmail,
    } = req.body;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const isLate = new Date() > new Date(assignment.deadline);

    const submission = await Submission.create({
      assignmentId,
      studentId,
      studentName,
      studentEmail,
      file: req.file?.filename,
      status: isLate ? "late" : "submitted",
    });

    await Assignment.findByIdAndUpdate(assignmentId, {
      $push: { submissions: submission._id },
    });

    if (studentEmail) {
      await sendEmail(
        studentEmail,
        "Submission Received",
        `Your assignment "${assignment.title}" submitted successfully.`
      );
    }

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};