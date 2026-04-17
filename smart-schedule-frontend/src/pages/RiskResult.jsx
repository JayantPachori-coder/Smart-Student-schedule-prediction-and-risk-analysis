import React from "react";
import { useLocation } from "react-router-dom";

import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

import { motion } from "framer-motion";
import "./RiskResult.css";

function RiskResult() {
  const location = useLocation();

  // =========================
  // SAFE STATE HANDLING
  // =========================
  const state = location?.state;

  if (!state?.result) {
    return (
      <div style={{ padding: 20 }}>
        <h2>❌ No Data Found</h2>
        <p>Please run analysis again.</p>
      </div>
    );
  }

  const result = state.result;

  // =========================
  // SAFE VALUES
  // =========================
  const confidence = Number(result?.confidence ?? 0);
  const riskLevel = result?.risk_level || "Unknown";
  const riskScore = Number(result?.risk_score ?? 0);

  const history = Array.isArray(state?.history)
    ? state.history
    : [];

  const isHighRisk = riskLevel === "High Risk";
  const isMediumRisk = riskLevel === "Medium Risk";

  // =========================
  // PIE DATA (SAFE)
  // =========================
  const pieData = [
    { name: "Confidence", value: confidence * 100 },
    { name: "Remaining", value: 100 - confidence * 100 }
  ];

  const PIE_COLORS = ["#00f2ff", "#ff4d4d"];

  // =========================
  // LINE DATA (SAFE)
  // =========================
  const trendData = history.map((item) => ({
    date: item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "N/A",

    risk:
      item?.riskLevel === "Low Risk" ? 1 :
      item?.riskLevel === "Medium Risk" ? 2 : 3
  }));

  // =========================
  // AI INSIGHTS
  // =========================
  const insights = isHighRisk
    ? ["🚨 Severe decline", "❌ Missing assignments", "📉 Low performance"]
    : isMediumRisk
    ? ["⚠️ Irregular study", "📊 Medium performance"]
    : ["✅ Stable performance", "📈 Good consistency"];

  const recommendations = isHighRisk
    ? ["🔴 Study 4+ hrs/day", "📚 Focus weak subjects", "⏰ Strict schedule"]
    : isMediumRisk
    ? ["📖 Study 2–3 hrs/day", "📝 Clear backlog"]
    : ["📘 Maintain routine", "✨ Keep consistency"];

  return (
    <motion.div className="dashboard-modern">

      {/* HEADER */}
      <div className="header">
        <h1>🍎 AI Risk Dashboard</h1>
      </div>

      {/* ALERT */}
      {isHighRisk && (
        <div className="risk-alert">
          ⚠️ HIGH RISK DETECTED
        </div>
      )}

      {/* KPI SECTION */}
      <div className="kpi-grid">

        <div className="kpi-card risk">
          <h2>{riskLevel}</h2>
          <p>{(confidence * 100).toFixed(2)}%</p>
          <small>Risk Score: {riskScore}</small>
        </div>

        {/* PIE CHART */}
        <div className="kpi-card pie">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="kpi-card chart">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#00f2ff"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* CONTENT SECTION */}
      <div className="content-grid">

        <div className="glass-card">
          <h3>🧠 AI Insights</h3>

          {(insights || []).map((item, i) => (
            <div key={i} className="chip">
              {item}
            </div>
          ))}
        </div>

        <div className="glass-card">
          <h3>🎯 Recommendations</h3>

          {(recommendations || []).map((item, i) => (
            <div key={i} className="chip green">
              {item}
            </div>
          ))}
        </div>

      </div>

    </motion.div>
  );
}

export default RiskResult;
