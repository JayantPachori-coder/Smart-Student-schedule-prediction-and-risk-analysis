import React, { useState } from "react";
import "./Proctored.css";
import CreateTest from "./CreateTest";
import QuestionBuilder from "./QuestionBuilder";

function AdminDashboard() {
  const [active, setActive] = useState("create");

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🌲 AI Proctor</h2>

        <div className="nav-item" onClick={() => setActive("create")}>
          ➕ Create Test
        </div>

        <div className="nav-item" onClick={() => setActive("questions")}>
          🧠 Question Builder
        </div>

        <div className="nav-item">
          📊 Analytics
        </div>

        <div className="nav-item">
          🚀 Publish Tests
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {active === "create" && <CreateTest />}
        {active === "questions" && <QuestionBuilder />}
      </div>
    </div>
  );
}

export default AdminDashboard;