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

  const confidence = Number(result?.confidence ?? 0);
  const riskLevel = result?.risk_level || "Unknown";
  const riskScore = Number(result?.risk_score ?? 0);

  const history = Array.isArray(state?.history) ? state.history : [];

  const isHighRisk = riskLevel === "High Risk";
  const isMediumRisk = riskLevel === "Medium Risk";

  // =========================
  // DATA
  // =========================
  const pieData = [
    { name: "Confidence", value: confidence * 100 },
    { name: "Remaining", value: 100 - confidence * 100 }
  ];

  const PIE_COLORS = ["#00f2ff", "#ff4d4d"];

  const trendData = history.map((item) => ({
    date: item?.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "N/A",
    risk:
      item?.riskLevel === "Low Risk" ? 1 :
      item?.riskLevel === "Medium Risk" ? 2 : 3
  }));

  const trendDirection =
    trendData.length >= 2
      ? trendData[trendData.length - 1].risk -
        trendData[trendData.length - 2].risk
      : 0;

  const consistencyScore =
    trendData.length > 0
      ? trendData.reduce((sum, item) => sum + item.risk, 0) /
        trendData.length
      : 0;

  const riskPercent = Math.min(100, Math.max(0, riskScore * 10));

  // =========================
  // GAUGE
  // =========================
  const GaugeMeter = ({ value }) => {
    const data = [
      { name: "Risk", value },
      { name: "Remaining", value: 100 - value }
    ];

    const getColor = () => {
      if (value < 40) return "#00ff99";
      if (value < 70) return "#ffc107";
      return "#ff4d4d";
    };

    return (
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
            >
              <Cell fill={getColor()} />
              <Cell fill="#222" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div style={{
          position: "relative",
          top: "-140px",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: getColor()
        }}>
          {value.toFixed(0)}%
        </div>
      </div>
    );
  };

  // =========================
  // 🔥 AI INSIGHTS (6–10)
  // =========================
  const insights = [];

  // Risk based
  if (isHighRisk) {
    insights.push("🚨 Critical academic risk detected");
    insights.push("📉 Performance is significantly declining");
  } else if (isMediumRisk) {
    insights.push("⚠️ Moderate academic risk detected");
  } else {
    insights.push("✅ Stable academic performance");
  }

  // Confidence
  if (confidence > 0.8) {
    insights.push("🔍 High confidence prediction");
  } else if (confidence > 0.5) {
    insights.push("📊 Moderate confidence level");
  } else {
    insights.push("❓ Low confidence — insufficient data");
  }

  // Trend
  if (trendDirection > 0) {
    insights.push("📈 Risk is increasing over time");
  } else if (trendDirection < 0) {
    insights.push("📉 Risk is improving gradually");
  } else {
    insights.push("➖ Risk trend is stable");
  }

  // Consistency
  if (consistencyScore > 2.5) {
    insights.push("⚠️ Poor consistency in academic performance");
  } else if (consistencyScore > 1.5) {
    insights.push("📊 Moderate consistency observed");
  } else {
    insights.push("✅ High consistency in studies");
  }

  // Extra insights
  insights.push("📚 Study pattern analysis completed");
  insights.push("🧠 Behavioral trends evaluated");
  insights.push("📊 Historical performance considered");

  // =========================
  // 🎯 RECOMMENDATIONS (6–10)
  // =========================
  const recommendations = [];

  if (isHighRisk) {
    recommendations.push("🔴 Immediate action required");
    recommendations.push("📚 Focus on weakest subjects");
    recommendations.push("⏰ Study 4–6 hrs daily");
    recommendations.push("🧑‍🏫 Seek mentor guidance");
    recommendations.push("📅 Follow strict timetable");
    recommendations.push("❌ Avoid distractions");
    recommendations.push("📝 Complete pending work");
    recommendations.push("📊 Practice past papers");
  } else if (isMediumRisk) {
    recommendations.push("📖 Study 2–4 hrs daily");
    recommendations.push("📝 Clear backlog subjects");
    recommendations.push("📊 Revise weak topics");
    recommendations.push("⏰ Improve time management");
    recommendations.push("📅 Follow weekly plan");
    recommendations.push("🎯 Focus on concepts");
    recommendations.push("📚 Practice regularly");
  } else {
    recommendations.push("📘 Maintain routine");
    recommendations.push("🚀 Try advanced questions");
    recommendations.push("📊 Continue revision");
    recommendations.push("🎯 Improve accuracy");
    recommendations.push("📅 Plan ahead");
    recommendations.push("🧠 Take mock tests");
  }

  if (trendDirection > 0) {
    recommendations.push("⚠️ Risk rising — act fast");
    recommendations.push("📉 Fix weak areas quickly");
  }

  if (confidence < 0.5) {
    recommendations.push("📊 Add more data inputs");
  }

  recommendations.push("💡 Take short breaks");
  recommendations.push("😴 Maintain proper sleep cycle");

  // =========================
  // UI
  // =========================
  return (
    <motion.div className="dashboard-modern">

      <div className="header">
        <h1>🍎 AI Risk Dashboard</h1>
      </div>

      {isHighRisk && (
        <div className="risk-alert">⚠️ HIGH RISK DETECTED</div>
      )}

      <div className="kpi-grid">

        <div className="kpi-card risk">
          <h2>{riskLevel}</h2>
          <p>{(confidence * 100).toFixed(2)}%</p>
          <small>Risk Score: {riskScore}</small>
        </div>

        <div className="kpi-card gauge">
          <h3>Risk Level</h3>
          <GaugeMeter value={riskPercent} />
        </div>

        <div className="kpi-card pie">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="kpi-card chart">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="risk" stroke="#00f2ff" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="content-grid">

        <div className="glass-card">
          <h3>🧠 AI Insights</h3>
          {insights.slice(0, 8).map((item, i) => (
            <div key={i} className="chip">{item}</div>
          ))}
        </div>

        <div className="glass-card">
          <h3>🎯 Recommendations</h3>
          {recommendations.slice(0, 8).map((item, i) => (
            <div key={i} className="chip green">{item}</div>
          ))}
        </div>

      </div>

    </motion.div>
  );
}

export default RiskResult;
