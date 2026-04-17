import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";
import "./RiskInsights.css";

const API = "https://smart-backend-2zlf.onrender.com/api/risk/history/${user._id}";

function RiskInsights() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const fetchHistory = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(`${API}/risk/history/${user._id}`);
      setHistory(res.data || []);
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/risk/predict-risk`, {
        ...form,
        userId: user?._id
      });

      generateAlert(res.data.risk_level);

      setTimeout(() => {
        setLoading(false);

        navigate("/risk-result", {
          state: {
            result: res.data,
            form,
            history
          }
        });

      }, 1200);

      fetchHistory();

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const generateAlert = (risk) => {
    if (risk === "High Risk") setAlert("⚠️ High Risk!");
    else if (risk === "Medium Risk") setAlert("⚡ Medium Risk");
    else setAlert("✅ Low Risk");
  };

  return (
    <div className="risk-container">

      <motion.h1 className="title">
        AI Risk Dashboard
      </motion.h1>

      {alert && <div className="alert">{alert}</div>}

      <form className="form" onSubmit={handleSubmit}>
        {Object.keys(form).map(key => (
          <input
            key={key}
            name={key}
            placeholder={key}
            onChange={handleChange}
          />
        ))}
        <button type="submit">Analyze</button>
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
