import express from "express";
import {
  getSubmissions,
  getByAssignment,
  evaluateSubmission,
  getStudentSubmissions, // ✅ ADD
} from "../controllers/SubmissionController.js";

const router = express.Router();

router.get("/", getSubmissions);
router.get("/assignment/:id", getByAssignment);
router.get("/student/:id", getStudentSubmissions); // ✅ NEW
router.post("/evaluate", evaluateSubmission);

export default router;
