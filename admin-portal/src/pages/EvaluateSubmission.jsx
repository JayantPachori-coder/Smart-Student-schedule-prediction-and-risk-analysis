// ✅ ONLY ONE default export

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Evaluation.css";

const API = "https://smart-backend-2zlf.onrender.com";

function EvaluateSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API}/api/submissions/${id}`);

        setData(res?.data?.data || null);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const submit = async () => {
    try {
      if (!marks) return alert("Enter marks");

      await axios.post(`${API}/api/submissions/evaluate`, {
        submissionId: id,
        marks: Number(marks),
        feedback,
      });

      alert("Evaluation Done 🚀");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Error evaluating submission");
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (!data) return <div className="page">Not found ❌</div>;

  return (
    <div className="page eval-grid">

      <div className="card glass">
        <h2>📄 Submission</h2>

        <p>
          <b>Student:</b> {data?.studentId?.firstName}
        </p>

        <p>
          <b>Assignment:</b> {data?.assignmentId?.title}
        </p>

        {data?.file && (
          <a
            href={`${API}/uploads/${data.file}`}
            target="_blank"
            rel="noreferrer"
          >
            Download File
          </a>
        )}
      </div>

      <div className="card glass">
        <h2>Evaluate</h2>

        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Marks"
        />

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
        />

        <button onClick={submit}>Submit</button>
      </div>

    </div>
  );
}

export default EvaluateSubmission;
