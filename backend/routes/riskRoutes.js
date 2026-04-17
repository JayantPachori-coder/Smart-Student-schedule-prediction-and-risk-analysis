import express from "express";
import { spawn } from "child_process";
import path from "path";

import RiskResult from "../models/RiskResult.js";
import User from "../models/User.js";
import EmailAlert from "../models/EmailAlert.js";
import { sendRiskEmail } from "../utils/sendRiskMail.js";

const router = express.Router();

// =============================
// 🔥 PREDICT RISK
// =============================
router.post("/predict-risk", async (req, res) => {
  try {
    const { userId, ...inputData } = req.body;

    const pythonScript = path.join(
      process.cwd(),
      "ml",
      "risk_model.py"
    );

    const python = spawn("python", [
      pythonScript,
      JSON.stringify(inputData),
    ]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
      console.error("PYTHON ERROR:", data.toString());
    });

    // =============================
    // TIMEOUT SAFETY
    // =============================
    const timeout = setTimeout(() => {
      python.kill("SIGKILL");
      return res.status(500).json({
        error: "Python execution timeout",
      });
    }, 15000);

    python.on("close", async () => {
      clearTimeout(timeout);

      try {
        if (!output || output.trim() === "") {
          return res.status(500).json({
            error: "Empty response from ML model",
            pythonError: error,
          });
        }

        const parsed = JSON.parse(output);

        // =============================
        // SAVE RESULT
        // =============================
        await RiskResult.create({
          userId,
          inputData,
          riskLevel: parsed.risk_level,
          confidence: parsed.confidence,
          riskScore: parsed.risk_score,
          insights: parsed.insights,
          recommendations: parsed.recommendations,
        });

        // =============================
        // USER FETCH
        // =============================
        const user = await User.findById(userId);

        if (user?.email) {
          try {
            await sendRiskEmail(
              user.email,
              parsed.risk_level,
              parsed.confidence
            );

            await EmailAlert.create({
              userId,
              email: user.email,
              riskLevel: parsed.risk_level,
              confidence: parsed.confidence,
              status: "SENT",
            });

          } catch (emailErr) {
            await EmailAlert.create({
              userId,
              email: user.email,
              riskLevel: parsed.risk_level,
              confidence: parsed.confidence,
              status: "FAILED",
            });
          }
        }

        return res.json(parsed);

      } catch (err) {
        return res.status(500).json({
          error: "Backend processing failed",
          details: err.message,
          raw: output,
          pythonError: error,
        });
      }
    });

    python.on("error", (err) => {
      clearTimeout(timeout);
      return res.status(500).json({
        error: "Python spawn failed",
        details: err.message,
      });
    });

  } catch (err) {
    res.status(500).json({
      error: "Server failed",
      details: err.message,
    });
  }
});

export default router;
