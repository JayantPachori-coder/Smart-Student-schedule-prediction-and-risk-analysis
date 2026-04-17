import React from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ShapDashboard() {
  const { state } = useLocation();

  if (!state) {
    return <h2>No SHAP Data Found</h2>;
  }

  const chartData = Object.entries(state.shap_values || {}).map(
    ([key, value]) => ({
      feature: key,
      impact: Number(value.toFixed(3))
    })
  );

  return (
    <div className="shap-dashboard">

      <h1>📊 SHAP Explainability Dashboard</h1>

      <div className="summary">
        <h3>Risk: {state.risk_level}</h3>
        <p>Confidence: {(state.confidence * 100).toFixed(2)}%</p>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="impact" fill="#00f2ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="input-box">
        <h3>User Input</h3>
        <pre>{JSON.stringify(state.input, null, 2)}</pre>
      </div>

    </div>
  );
}

export default ShapDashboard;