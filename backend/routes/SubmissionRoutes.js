import express from "express";
import {
  getSubmissions,
  getByAssignment,
  evaluateSubmission,
} from "../controllers/submissionController.js";

const router = express.Router();

router.get("/", getSubmissions);
router.get("/assignment/:id", getByAssignment);
router.post("/evaluate", evaluateSubmission);

export default router;