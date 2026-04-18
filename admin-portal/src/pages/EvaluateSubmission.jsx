import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Evaluation.css";

// ✅ Central API (DO NOT use localhost in production)
const API = "https://smart-backend-2zlf.onrender.com";

export default function EvaluateSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD SUBMISSION
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/submissions`);

        const submissions = res?.data?.data || [];

        const found = submissions.find((x) => x._id === id);

        setData(found ?? null);
      } catch (err) {
        console.error("Fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  /* =========================
     SUBMIT EVALUATION
  ========================= */
  const submit = async () => {
    try {
      if (!marks) {
        alert("Please enter marks");
        return;
      }

      await axios.post(`${API}/api/submissions/evaluate`, {
        submissionId: id,
        marks: Number(marks), // ✅ ensure number type
        feedback,
      });

      alert("Evaluation Done 🚀");

      navigate(-1);
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Error evaluating submission");
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return <div className="page">Loading submission...</div>;
  }

  if (!data) {
    return <div className="page">Submission not found ❌</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page eval-grid">

      {/* LEFT SIDE */}
      <div className="card glass">
        <h2>📄 Submission</h2>

        <p>
          <b>Student:</b>{" "}
          {data?.studentId?.firstName || "Unknown"}
        </p>

        <p>
          <b>Assignment:</b>{" "}
          {data?.assignmentId?.title || "N/A"}
        </p>

        {data?.file && (
          <a
            href={`${API}/uploads/${data.file}`}
            target="_blank"
            rel="noreferrer"
          >
            ⬇ Download Submitted File
          </a>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="card glass">
        <h2>🧑‍🏫 Evaluate Submission</h2>

        <input
          type="number"
          placeholder="Marks (out of 100)"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />

        <textarea
          placeholder="Feedback for student"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button onClick={submit}>
          Submit Evaluation 🚀
        </button>
      </div>

    </div>
  );
}
