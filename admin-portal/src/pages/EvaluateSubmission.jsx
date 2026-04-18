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
     FETCH SUBMISSIONS
  ========================= */
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/submissions/assignment/${id}`
        );

        console.log("API RESPONSE:", res.data);

        // ✅ FIX: take first submission safely
        const submissions = res?.data?.data || [];

        setSubmission(submissions.length > 0 ? submissions[0] : null);

      } catch (err) {
        console.error("Error:", err.message);
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
      if (!marks) {
        alert("Please enter marks");
        return;
      }

      await axios.post(`${API}/api/submissions/evaluate`, {
        submissionId: submission._id, // ✅ correct
        marks: Number(marks),
        feedback: feedback,
      });

      alert("Evaluation submitted 🚀");
      navigate(-1);
    } catch (err) {
      console.error(err.message);
      alert("Failed to submit evaluation");
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) return <div className="page">Loading...</div>;

  if (!submission) return <div className="page">No submission found ❌</div>;

  /* =========================
     UI
  ========================= */
  return (
    <div className="page eval-grid">

      <div className="card glass">
        <h2>📄 Submission Details</h2>

        <p><b>Student:</b> {submission.studentId?.firstName}</p>
        <p><b>Email:</b> {submission.studentId?.email}</p>
        <p><b>Assignment:</b> {submission.assignmentId?.title}</p>
        <p><b>Status:</b> {submission.status}</p>

        {submission.file && (
          <a
            href={`${API}/uploads/${submission.file}`}
            target="_blank"
          >
            Download File
          </a>
        )}
      </div>

      <div className="card glass">
        <h2>🧑‍🏫 Evaluate</h2>

        <input
          type="number"
          placeholder="Marks"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
        />

        <textarea
          placeholder="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button onClick={handleSubmit}>
          Submit 🚀
        </button>
      </div>

    </div>
  );
}
