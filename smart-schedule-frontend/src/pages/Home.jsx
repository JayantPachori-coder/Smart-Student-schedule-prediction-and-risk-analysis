import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaChartLine,
  FaUserShield,
  FaTasks,
  FaEye
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const moveLight = (e) => {
      const light = document.querySelector(".cursor-light");
      if (light) {
        light.style.left = e.clientX + "px";
        light.style.top = e.clientY + "px";
      }
    };

    window.addEventListener("mousemove", moveLight);
    return () => window.removeEventListener("mousemove", moveLight);
  }, []);

  const buttons = [
    { text: "Schedule Prediction", icon: <FaCalendarAlt />, path: "/schedule-prediction" },
    { text: "Risk Insights", icon: <FaChartLine />, path: "/risk-insights" },
    { text: "Proctored Test", icon: <FaUserShield />, path: "/proctored-test" },
    { text: "Assignments", icon: <FaTasks />, path: "/assignments" },
    { text: "View Schedule", icon: <FaEye />, path: "/view-schedule" }
  ];

  return (
    <div className="home-container">

      <div className="cursor-light" />

      {/* Top floating header (Apple SaaS feel) */}
      <div className="top-bar">
        <div className="logo">Smart<span>AI</span></div>
        <div className="status">● Live System</div>
      </div>

      <div className="home-content">

        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Intelligent Study Dashboard
        </motion.h1>

        <p className="subtitle">
          AI-powered scheduling, risk analysis & smart academic control
        </p>

        <div className="button-group">
          {buttons.map((btn, i) => (
            <motion.div
              key={i}
              className="card"
              onClick={() => navigate(btn.path)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="glow" />
              <div className="card-icon">{btn.icon}</div>
              <h3>{btn.text}</h3>
              <p>Open module →</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;