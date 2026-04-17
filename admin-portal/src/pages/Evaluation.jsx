import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EvaluatePanel() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/assignments"
        );

        setAssignments(res.data.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="page">
      <h2>📚 Evaluation Panel</h2>

      <div className="grid">
        {assignments.length > 0 ? (
          assignments.map((a) => (
            <div key={a._id} className="card glass">
              <h3>{a.title}</h3>
              <p>{a.description}</p>

              <button
                className="btn"
                onClick={() =>
                  navigate(`/assignment/${a._id}/submissions`)
                }
              >
                View Submissions
              </button>
            </div>
          ))
        ) : (
          <p>No assignments found</p>
        )}
      </div>
    </div>
  );
}