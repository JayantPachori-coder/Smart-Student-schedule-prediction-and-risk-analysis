import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Evaluation.css";

export default function SubmissionList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/submissions/assignment/${id}`)
      .then((res) => setSubs(res.data.data || []));
  }, [id]);

  return (
    <div className="page">
      <h2>📄 Submitted Students</h2>

      <div className="grid">
        {subs.map((s) => (
          <div key={s._id} className="card glass">

            <h3>{s.studentId?.firstName}</h3>
            <p>{s.assignmentId?.title}</p>

            <p className="meta">
              ⏱ {new Date(s.createdAt).toLocaleString()}
            </p>

            <span className={`status ${s.status}`}>
              {s.status}
            </span>

            {/* 🔥 FIX FILE DOWNLOAD */}
            {s.file && (
              <a
                className="btn"
                href={`http://localhost:5000/uploads/${s.file}`}
                target="_blank"
                rel="noreferrer"
              >
                ⬇ Download File
              </a>
            )}

            <button
              className="btn"
              onClick={() =>
                navigate(`/evaluate/submission/${s._id}`)
              }
            >
              Evaluate
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}