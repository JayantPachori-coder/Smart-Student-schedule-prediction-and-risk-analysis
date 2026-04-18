import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Evaluation.css";

const API = "https://smart-backend-2zlf.onrender.com";

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

        // 🔁 Retry logic (fixes Render cold start)
        for (let i = 0; i < 3; i++) {
          try {
            res = await axios.get(
              `${API}/api/submissions/assignment/${id}`
            );
            break;
          } catch (err) {
            console.warn("Retrying request...", i + 1);
            await new Promise((r) => setTimeout(r, 2000)); // wait 2s
          }
        }

        if (!res) {
          throw new Error("Server not responding");
        }

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

      await axios.post(`${API}/api/submissions/evaluate`, {
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
        <small>Check assignment ID or backend route</small>
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
              href={`${API}/uploads/${s.file}`}
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
