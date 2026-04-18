import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";

// ✅ ROUTES (make sure filenames are lowercase in your project)
import authRoutes from "./routes/authRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";
import assignmentRoutes from "./routes/assignmentRoute.js";
import teacherAuth from "./routes/teacherAuth.js";
import submissionRoutes from "./routes/SubmissionRoutes.js"; // ✅ IMPORTANT FIX

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

// ✅ CORS FIX (important for frontend)
app.use(
  cors({
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ BODY PARSING
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES (file download)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   DB CONNECTION
========================= */
connectDB();

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/teacher", teacherAuth);
app.use("/api/submissions", submissionRoutes);

// ✅ DEBUG LOG (to confirm route loaded)
console.log("✅ All routes loaded successfully");

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "🚀 AI Backend Running Successfully",
  });
});

/* =========================
   404 HANDLER (IMPORTANT)
========================= */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =========================
   START SERVER
========================= */
const PORT = "https://smart-backend-2zlf.onrender.com" || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
