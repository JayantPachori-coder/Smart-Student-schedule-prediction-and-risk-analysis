import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dash-container">

      {/* HEADER */}
      <div className="glass-header">
        <h1>👨‍🏫 Admin Control Panel</h1>
        <p>Assignments • Submissions • Evaluation System</p>
      </div>

      {/* CARDS GRID */}
      <div className="card-grid">

        <div className="card" onClick={() => navigate("/create")}>
          <h2>➕ Create Assignment</h2>
          <p>Create and assign tasks to students</p>
        </div>

        <div className="card" onClick={() => navigate("/view")}>
          <h2>📋 View Assignments</h2>
          <p>Manage all assignments</p>
        </div>

        {/* NEW: EVALUATION */}
        <div className="card" onClick={() => navigate("/evaluate")}>
          <h2>🧑‍🏫 Evaluation Panel</h2>
          <p>Grade & give feedback to students</p>
        </div>

        {/* LOGOUT */}
        <div className="card logout" onClick={logout}>
          <h2>🚪 Logout</h2>
          <p>Exit admin session</p>
        </div>

      </div>
    </div>
  );
}
