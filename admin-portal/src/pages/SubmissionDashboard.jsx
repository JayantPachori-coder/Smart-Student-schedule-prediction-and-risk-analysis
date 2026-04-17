import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Submission.css';

export default function SubmissionDashboard() {
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/submissions")
      .then(res => setSubs(res.data));
  }, []);

  return (
    <div className="page">

      {subs.map(s => (
        <div key={s._id} className="glass card">
          <h3>{s.studentId.firstName}</h3>
          <p>{s.assignmentId.title}</p>
          <span>{s.status}</span>

          <button className="btn" onClick={() => navigate(`/evaluate/${s._id}`)}>
            Evaluate
          </button>
        </div>
      ))}

    </div>
  );
}