import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import "./RiskInsights.css";

const BASE_API = "https://smart-backend-2zlf.onrender.com/api";

function RiskInsights() {
  const navigate = useNavigate();

  // ✅ safer parsing
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

  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value)
    }));
  };

  // ================= HISTORY =================
  const fetchHistory = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(
        `${BASE_API}/risk/history/${user._id}`
      );

      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("History error:", err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ================= ANALYZE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // alert
      if (result.risk_level === "High Risk") setAlert("⚠️ High Risk!");
      else if (result.risk_level === "Medium Risk") setAlert("⚡ Medium Risk");
      else setAlert("✅ Low Risk");

      // update history before navigation (optional safety)
      await fetchHistory();

      setLoading(false);

      // ✅ immediate navigation (NO timeout needed)
      navigate("/risk-result", {
        state: {
          result,
          form,
          history
        }
      });

    } catch (err) {
      console.log("Prediction error:", err);
      setLoading(false);
      alert("Prediction failed. Check backend.");
    }
  };

  return (
    <div className="risk-container">

      <motion.h1 className="title">
        AI Risk Dashboard
      </motion.h1>

      {alert && <div className="alert">{alert}</div>}

      <form className="form" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
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
