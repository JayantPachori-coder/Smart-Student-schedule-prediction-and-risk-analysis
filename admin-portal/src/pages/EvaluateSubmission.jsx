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

  // ================= FETCH =================
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/submissions/assignment/${id}`
        );

        console.log("API RESPONSE:", res.data);

        setSubmissions(res?.data?.data || []);

      } catch (err) {
        console.error("Error:", err.message);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubmissions();
  }, [id]);

  // ================= SUBMIT =================
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

      alert("Evaluated 🚀");

    } catch (err) {
      console.error(err.message);
      alert("Failed");
    }
  };

  // ================= UI =================
  if (loading) return <div className="page">Loading...</div>;

  if (submissions.length === 0)
    return <div className="page">No submissions found ❌</div>;

  return (
    <div className="page eval-grid">
      {submissions.map((s) => (
        <div className="card glass" key={s._id}>
          <h3>{s.assignmentId?.title}</h3>

          <p><b>Student:</b> {s.studentId?.firstName}</p>
          <p><b>Email:</b> {s.studentId?.email}</p>
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

          <input
            type="number"
            placeholder="Marks"
            value={marks[s._id] || ""}
            onChange={(e) =>
              setMarks({ ...marks, [s._id]: e.target.value })
            }
          />

          <textarea
            placeholder="Feedback"
            value={feedback[s._id] || ""}
            onChange={(e) =>
              setFeedback({ ...feedback, [s._id]: e.target.value })
            }
          />

          <button onClick={() => handleSubmit(s._id)}>
            Submit Evaluation 🚀
          </button>
        </div>
      ))}
    </div>
  );
}
