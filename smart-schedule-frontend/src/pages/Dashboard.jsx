import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user] = useState({
    firstName: "Jayant",
    lastName: "Pachori",
    username: "JayantP23",
  });

  const [showProfile, setShowProfile] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard-fullpage">
      {/* Topbar */}
      <div className="topbar">
        <div className="clock">{time.toLocaleTimeString()}</div>
        <div
          className="profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <img src="https://i.pravatar.cc/40" alt="user" />
        </div>
      </div>

      {/* Profile Dropdown */}
      {showProfile && (
        <div className="profile-dropdown">
          <p>
            <strong>
              {user.firstName} {user.lastName}
            </strong>
          </p>
          <p>{user.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="animate-text">Smart Study Scheduling System</h1>
          <p className="animate-text delay">
            AI-powered scheduling, assignment tracking, and risk analysis
            to boost your productivity.
          </p>
          <button
            className="btn primary animate-btn"
            onClick={() => navigate("/schedule-prediction")}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <div className="chatbot">💬</div>
    </div>
  );
}

export default Dashboard;