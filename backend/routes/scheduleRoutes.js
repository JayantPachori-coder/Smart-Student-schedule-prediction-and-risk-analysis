import express from "express";
import { spawn } from "child_process";
import path from "path";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import { generateSchedulePDF } from "../utils/generatePDF.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import sendScheduleEmail from "../utils/sendScheduleEmail.js";
const router = express.Router();

/* =========================
   REAL TIME SLOTS (1 HOUR EACH)
========================= */
const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 01:00",
  "01:00 - 02:00",
  "02:00 - 03:00",
  "03:00 - 04:00",
  "04:00 - 05:00",
  "05:00 - 06:00"
];

/* =========================
   SAFE PARSER
========================= */
const parseHours = (val) => {
  return Math.min(2, Math.max(1, parseInt(val) || 1)); // FORCE 1–2 ONLY
};

/* =========================
   SLOT ASSIGNMENT ENGINE
========================= */
const assignSlots = (subjects) => {
  let slotIndex = 0;

  return subjects.map((sub) => {
    const hours = parseHours(sub.predictedHours);

    const blockHours = [];

    for (let i = 0; i < hours; i++) {
      if (slotIndex >= TIME_SLOTS.length) break;

      blockHours.push({
        timeBlock: TIME_SLOTS[slotIndex],
        hours: 1
      });

      slotIndex++;
    }

    return {
      name: sub.name,
      predictedHours: hours,
      blockHours
    };
  });
};

/* =========================
   PREDICT ROUTE
========================= */
router.post("/predict", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjects } = req.body;

    if (!Array.isArray(subjects)) {
      return res.status(400).json({ error: "subjects must be array" });
    }

    const user = await User.findById(userId);
    if (!user?.email) {
      return res.status(404).json({ error: "User not found" });
    }

    const scriptPath = path.join(process.cwd(), "ml", "predict.py");

    const python = spawn("python", [
      scriptPath,
      JSON.stringify(subjects)
    ]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    const timeout = setTimeout(() => python.kill("SIGKILL"), 30000);

    python.on("close", async (code) => {
      clearTimeout(timeout);

      console.log("PYTHON EXIT:", code);
      console.log("PYTHON ERR:", errorOutput);

      if (code !== 0) {
        return res.status(500).json({
          error: "Python failed",
          details: errorOutput
        });
      }

      try {
        // =========================
        // PARSE PYTHON OUTPUT
        // =========================
        let predicted;

        try {
          predicted = JSON.parse(output.trim());
        } catch (e) {
          const match = output.match(/\[.*\]/s);
          if (!match) {
            return res.status(500).json({
              error: "Invalid Python output",
              raw: output
            });
          }
          predicted = JSON.parse(match[0]);
        }

        // =========================
        // SLOT ASSIGNMENT (MAIN FIX)
        // =========================
        const finalSchedule = assignSlots(predicted);

        // =========================
        // SAVE TO DB
        // =========================
        const scheduleDoc = new Schedule({
          userId,
          subjects: finalSchedule
        });

        await scheduleDoc.save();

        // =========================
        // PDF + EMAIL (NON BLOCKING)
        // =========================
        const pdfBuffer = await generateSchedulePDF(finalSchedule);

        sendScheduleEmail(user.email, pdfBuffer)
          .then(() => console.log("Email sent"))
          .catch((err) => console.log("Email error:", err.message));

        // =========================
        // RESPONSE
        // =========================
        return res.json({
          schedule: finalSchedule
        });

      } catch (err) {
        return res.status(500).json({
          error: "Processing failed",
          raw: output
        });
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   HISTORY ROUTE
========================= */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const data = await Schedule.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;