import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Evaluation.css";

export default function EvaluateSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  /* =========================
     LOAD SUBMISSION
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/submissions"
        );

        const found = res.data.data?.find((x) => x._id === id);

        setData(found || null);
      } catch (err) {
        console.log("Fetch error:", err);
      }
    };

    fetchData();
  }, [id]);

  /* =========================
     SUBMIT EVALUATION
  ========================= */
  const submit = async () => {
    try {
      if (!marks) return alert("Please enter marks");

      await axios.post(
        "http://localhost:5000/api/submissions/evaluate",
        {
          submissionId: id,
          marks,
          feedback,
        }
      );

      alert("Evaluation Done 🚀");

      // go back to submissions list
      navigate(-1);

    } catch (err) {
      console.log(err);
      alert("Error evaluating submission");
    }
  };

  /* =========================
     LOADING STATE
  ========================= */
  if (!data) {
    return <div className="page">Loading submission...</div>;
  }

  return (
    <div className="page eval-grid">

      {/* LEFT SIDE */}
      <div className="card glass">
        <h2>📄 Submission</h2>

        <p><b>Student:</b> {data.studentId?.firstName}</p>
        <p><b>Assignment:</b> {data.assignmentId?.title}</p>

        {/* FILE DOWNLOAD FIX */}
        {data.file && (
          <a
            href={`http://localhost:5000/uploads/${data.file}`}
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