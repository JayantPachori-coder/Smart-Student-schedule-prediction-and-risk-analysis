import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EvaluatePanel() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  const API = "https://smart-backend-2zlf.onrender.com";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${API}/api/assignments`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setAssignments(data);
      } catch (err) {
        console.log("Fetch error:", err);
        setAssignments([]);
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
