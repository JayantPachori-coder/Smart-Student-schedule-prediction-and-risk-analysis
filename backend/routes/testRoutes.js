import express from "express";
import {
  createTest,
  addQuestion,
  publishTest,
  getTests
} from "../controllers/testController.js";

const router = express.Router();

router.post("/create", createTest);
router.post("/question", addQuestion);
router.put("/publish", publishTest);
router.get("/", getTests);

export default router;