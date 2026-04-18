import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ USE THIS INSTEAD OF AXIOS
import { useParams } from "react-router-dom";
import "./Evaluation.css";

export default function EvaluateSubmission() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH WITH RETRY
  ========================= */
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        console.log("📌 Assignment ID:", id);

        let res = null;

        // 🔁 Retry logic (Render cold start fix)
        for (let i = 0; i < 3; i++) {
          try {
            res = await api.get(`/api/submissions/assignment/${id}`);
            break;
          } catch (err) {
            console.warn("Retrying...", i + 1);
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        if (!res) throw new Error("Server not responding");

        console.log("✅ API RESPONSE:", res.data);

        setSubmissions(res?.data?.data || []);

      } catch (err) {
        console.error("❌ FINAL ERROR:", err);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmissions();
  }, [id]);

  /* =========================
     SUBMIT EVALUATION
  ========================= */
  const handleSubmit = async (submissionId) => {
    try {
      if (!marks[submissionId]) {
        alert("Enter marks");
        return;
      }

      await api.post(`/api/submissions/evaluate`, {
        submissionId,
        marks: Number(marks[submissionId]),
        feedback: feedback[submissionId] || "",
      });

      alert("Evaluation submitted 🚀");

      // ✅ Update UI instantly
      setSubmissions((prev) =>
        prev.map((s) =>
          s._id === submissionId
            ? { ...s, status: "evaluated" }
            : s
        )
      );

    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to submit evaluation");
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return <div className="page">⏳ Loading submissions...</div>;
  }

  if (!loading && submissions.length === 0) {
    return (
      <div className="page">
        ❌ No submissions found
        <br />
        <small>Check assignment ID or backend</small>
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page eval-grid">
      {submissions.map((s) => (
        <div className="card glass" key={s._id}>
          <h3>{s.assignmentId?.title || "Assignment"}</h3>

          <p><b>Student:</b> {s.studentId?.firstName || "N/A"}</p>
          <p><b>Email:</b> {s.studentId?.email || "N/A"}</p>
          <p><b>Status:</b> {s.status}</p>

          {s.file && (
            <a
              href={`https://smart-backend-2zlf.onrender.com/uploads/${s.file}`}
              target="_blank"
              rel="noreferrer"
            >
              📥 Download File
            </a>
          )}

          {/* MARKS */}
          <input
            type="number"
            placeholder="Marks"
            value={marks[s._id] || ""}
            onChange={(e) =>
              setMarks((prev) => ({
                ...prev,
                [s._id]: e.target.value,
              }))
            }
          />

          {/* FEEDBACK */}
          <textarea
            placeholder="Feedback"
            value={feedback[s._id] || ""}
            onChange={(e) =>
              setFeedback((prev) => ({
                ...prev,
                [s._id]: e.target.value,
              }))
            }
          />

          {/* BUTTON */}
          <button
            onClick={() => handleSubmit(s._id)}
            disabled={s.status === "evaluated"}
          >
            {s.status === "evaluated"
              ? "✅ Evaluated"
              : "Submit Evaluation 🚀"}
          </button>
        </div>
      ))}
    </div>
  );
}
