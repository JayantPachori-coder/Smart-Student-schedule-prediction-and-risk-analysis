import express from "express";
import multer from "multer";

import {
  createAssignment,
  getAssignments,
  submitAssignment,
  updateAssignment,
  deleteAssignment
} from "../controllers/assignmentController.js";

const router = express.Router();

/* =========================
   MULTER SETUP
========================= */
const upload = multer({
  dest: "uploads/", // make sure this folder exists
});

/* =========================
   ROUTES
========================= */

router.post("/", createAssignment);
router.get("/", getAssignments);

// 🔥 FIXED: file upload middleware added
router.post("/submit", upload.single("file"), submitAssignment);

router.put("/:id", updateAssignment);
router.delete("/:id", deleteAssignment);

export default router;