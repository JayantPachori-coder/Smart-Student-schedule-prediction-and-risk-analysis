import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import "./RiskInsights.css";

const BASE_API = "https://smart-backend-2zlf.onrender.com/api";

function RiskInsights() {
  const navigate = useNavigate();

  // safe user parsing
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const [form, setForm] = useState({
    attendance: "",
    avg_score: "",
    assignments_completed: "",
    study_hours: "",
    missed_deadlines: "",
    login_frequency: "",
    consistency_score: ""
  });

  const [, setHistory] = useState([]); // ✅ FIX: removed unused variable (no ESLint error)

  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // input handler
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value)
    }));
  };

  // fetch history (kept safe, but no state usage)
  const fetchHistory = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(
        `${BASE_API}/risk/history/${user._id}`
      );

      setHistory(res.data || []);
    } catch (err) {
      console.log("History error:", err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ANALYZE CLICKED");

    if (!user?._id) {
      alert("User not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_API}/risk/predict-risk`,
        {
          ...form,
          userId: user._id
        }
      );

      const result = res.data;

      // alert message
      if (result.risk_level === "High Risk") {
        setAlertMsg("⚠️ High Risk!");
      } else if (result.risk_level === "Medium Risk") {
        setAlertMsg("⚡ Medium Risk!");
      } else {
        setAlertMsg("✅ Low Risk!");
      }

      setLoading(false);

      // navigation (SAFE)
      navigate("/risk-result", {
        state: {
          result,
          form
        }
      });

    } catch (err) {
      console.log("Prediction error:", err?.response?.data || err.message);

      setLoading(false);
      alert("Backend error (check server logs)");
    }
  };

  return (
    <div className="risk-container">

      <motion.h1 className="title">
        AI Risk Dashboard
      </motion.h1>

      {alertMsg && <div className="alert">{alertMsg}</div>}

      <form className="form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            type="number"
            onChange={handleChange}
          />
        ))}

        <button type="submit" disabled={loading}>
          Analyze
        </button>
      </form>

      {loading && (
        <div className="loading-box">
          <Circles color="#00f2ff" height={80} width={80} />
          <p>Analyzing AI Risk Model...</p>
        </div>
      )}

    </div>
  );
}

export default RiskInsights;
