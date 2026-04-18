import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Evaluation.css";

const API = "https://smart-backend-2zlf.onrender.com";

export default function EvaluateSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH SUBMISSION
  ========================= */
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/submissions/${id}`);

        setSubmission(res?.data?.data || null);
      } catch (err) {
        console.error("Error fetching submission:", err);
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmission();
  }, [id]);

  /* =========================
     SUBMIT EVALUATION
  ========================= */
  const handleSubmit = async () => {
    try {
      if (!marks.toString().trim()) {
        alert("Please enter marks");
        return;
      }

      await axios.post(`${API}/api/submissions/evaluate`, {
        submissionId: id,
        marks: Number(marks),
        feedback: feedback.trim(),
      });

      alert("Evaluation submitted successfully 🚀");
      navigate(-1);
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Failed to submit evaluation");
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return <div className="page">Loading submission...</div>;
  }

  if (!submission) {
    return <div className="page">Submission not found ❌</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page eval-grid">

      {/* LEFT SIDE */}
      <div className="card glass">
        <h2>📄 Submission Details</h2>

        <p>
          <b>Student:</b>{" "}
          {submission?.studentId?.firstName || "Unknown"}
        </p>

        <p>
          <b>Email:</b>{" "}
          {submission?.studentId?.email || "N/A"}
        </p>

        <p>
          <b>Assignment:</b>{" "}
          {submission?.assignmentId?.title || "N/A"}
        </p>

        <p>
          <b>Status:</b> {submission?.status || "submitted"}
        </p>

        {submission?.file && (
          <a
            href={`${API}/uploads/${submission.file}`}
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
          placeholder="Enter marks (out of 100)"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          min="0"
          max="100"
        />

        <textarea
          placeholder="Write feedback for student..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Submit Evaluation 🚀
        </button>
      </div>

    </div>
  );
}
