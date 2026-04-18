import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

import SchedulePrediction from "./pages/SchedulePrediction";
import RiskInsights from "./pages/RiskInsights";
import ProctoredTest from "./pages/ProctoredTest";
import Assignments from "./pages/Assignments";
import ViewSchedule from "./pages/ViewSchedule";

import ShapDashboard from "./pages/ShapDashboard";
import RiskResult from "./pages/RiskResult";

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MAIN */}
        <Route path="/home" element={<Home />} />

        {/* FEATURES */}
        <Route path="/schedule-prediction" element={<SchedulePrediction />} />
        <Route path="/risk-insights" element={<RiskInsights />} />
        <Route path="/proctored-test" element={<ProctoredTest />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/view-schedule" element={<ViewSchedule />} />

        {/* AI MODULE */}
        <Route path="/shap-dashboard" element={<ShapDashboard />} />
        <Route path="/risk-result" element={<RiskResult />} />

      </Routes>
    </Router>
  );
}

export default App;
