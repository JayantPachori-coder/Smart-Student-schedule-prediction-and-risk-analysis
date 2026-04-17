import express from "express";
import { spawn } from "child_process";
import path from "path";

import RiskResult from "../models/RiskResult.js";
import User from "../models/User.js";
import EmailAlert from "../models/EmailAlert.js";

import { sendRiskEmail } from "../utils/sendRiskMail.js";

const router = express.Router();

// =============================
// 🔥 PREDICT RISK (ML ENGINE)
// =============================
router.post("/predict-risk", async (req, res) => {
  try {
    const { userId, ...inputData } = req.body;

    console.log("📥 Incoming:", inputData);

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
    });

    python.on("close", async () => {
      try {
        console.log("🐍 Python Output:", output);

        if (error) {
          console.log("⚠️ Python Error:", error);
        }

        if (!output || output.trim() === "") {
          return res.status(500).json({
            error: "Empty response from ML model",
          });
        }

        const parsed = JSON.parse(output);

        // =============================
        // 🧠 SAVE ML RESULT
        // =============================
        await RiskResult.create({
          userId,
          inputData,
          riskLevel: parsed.risk_level,
          confidence: parsed.confidence,
          shapValues: parsed.shap_values,
          insights: parsed.insights,
          recommendations: parsed.recommendations,
        });

        // =============================
        // 📩 GET USER EMAIL
        // =============================
        const user = await User.findById(userId);

        if (user?.email) {
          try {
            // =============================
            // 📧 SEND EMAIL
            // =============================
            await sendRiskEmail(
              user.email,
              parsed.risk_level,
              parsed.confidence
            );

            // =============================
            // 🗄 SAVE EMAIL LOG
            // =============================
            await EmailAlert.create({
              userId,
              email: user.email,
              riskLevel: parsed.risk_level,
              confidence: parsed.confidence,
              status: "SENT",
            });

            console.log("📩 Email sent + logged:", user.email);

          } catch (emailErr) {
            console.log("❌ Email failed:", emailErr.message);

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
        console.log("❌ Backend Error:", err.message);

        return res.status(500).json({
          error: "Backend processing failed",
          raw: output,
        });
      }
    });

    python.on("error", (err) => {
      console.log("❌ Python Error:", err.message);
      return res.status(500).json({
        error: "Python execution failed",
      });
    });

  } catch (err) {
    console.log("❌ Server Error:", err.message);
    res.status(500).json({ error: "Server failed" });
  }
});

// =============================
// 📊 RISK HISTORY
// =============================
router.get("/history/:userId", async (req, res) => {
  try {
    const data = await RiskResult.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "History fetch failed" });
  }
});

// =============================
// 📧 EMAIL HISTORY
// =============================
router.get("/email-history/:userId", async (req, res) => {
  try {
    const logs = await EmailAlert.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Email history fetch failed" });
  }
});

export default router;