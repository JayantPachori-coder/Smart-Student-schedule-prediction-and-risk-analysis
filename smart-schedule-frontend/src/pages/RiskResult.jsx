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
  const { state } = useLocation();

  const [darkMode, setDarkMode] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([
    { role: "bot", text: "👋 Hi! I am your AI Study Assistant. Ask me anything!" }
  ]);

  const dashboardRef = React.useRef();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = React.useRef(null);
  const isListening = React.useRef(false);

  if (!recognitionRef.current && SpeechRecognition) {
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    recognitionRef.current = rec;
  }

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  if (!state) return <h2>No Data Found</h2>;

  const { result, history } = state;

  const isHighRisk = result.risk_level === "High Risk";
  const isMediumRisk = result.risk_level === "Medium Risk";

  /* ================= PIE DATA ================= */
  const pieData = [
    { name: "Confidence", value: result.confidence * 100 },
    { name: "Remaining", value: 100 - result.confidence * 100 }
  ];

  const PIE_COLORS = ["#00f2ff", "#ff4d4d"];

  /* ================= LINE DATA ================= */
  const trendData = history.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    risk:
      item.riskLevel === "Low Risk" ? 1 :
      item.riskLevel === "Medium Risk" ? 2 : 3
  }));

  /* ================= AI ================= */
  const generateResponse = (text) => {
    if (isHighRisk) {
      return "🚨 High risk detected — follow strict study plan.";
    }
    if (isMediumRisk) {
      return "⚠️ Medium risk — improve consistency.";
    }
    return "✅ You are doing great!";
  };

  const sendMessage = (custom) => {
    const text = custom || input;
    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    const botMsg = { role: "bot", text: generateResponse(text) };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");

    speak(botMsg.text);
  };

  const startVoice = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening.current) {
      recognition.stop();
      isListening.current = false;
      return;
    }

    isListening.current = true;

    try {
      recognition.start();
    } catch (e) {}

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
      sendMessage(voiceText);
    };

    recognition.onend = () => {
      isListening.current = false;
    };
  };

  /* ================= INSIGHTS ================= */
  const insights = isHighRisk
    ? ["🚨 Severe decline", "❌ Missing assignments", "📉 Low performance"]
    : isMediumRisk
    ? ["⚠️ Irregular study", "📊 Medium performance"]
    : ["✅ Stable performance", "📈 Good consistency"];

  const recommendations = isHighRisk
    ? ["🔴 Study 4+ hrs", "📚 Focus weak subjects", "⏰ Strict routine"]
    : isMediumRisk
    ? ["📖 Study 2–3 hrs", "📝 Fix backlog"]
    : ["📘 Maintain routine"];

  return (
    <motion.div ref={dashboardRef} className={`dashboard-modern ${darkMode ? "dark" : "light"}`}>

      {/* HEADER */}
      <div className="header">
        <h1>🍎 AI Risk Dashboard</h1>

        <button className="btn secondary" onClick={() => setDarkMode(!darkMode)}>
          Toggle Theme
        </button>
      </div>

      {/* ALERT */}
      {isHighRisk && (
        <div className="risk-alert">
          ⚠️ HIGH RISK DETECTED
        </div>
      )}

      {/* KPI */}
      <div className="kpi-grid">

        <div className="kpi-card risk">
          <h2>{result.risk_level}</h2>
          <p>{(result.confidence * 100).toFixed(2)}%</p>
        </div>

        {/* PIE */}
        <div className="kpi-card pie">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
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
                dot={{ fill: "#ff4d4d", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* CONTENT */}
      <div className="content-grid">

        <div className="glass-card">
          <h3>🧠 AI Insights</h3>
          {insights.map((i, idx) => (
            <div key={idx} className="chip">{i}</div>
          ))}
        </div>

        <div className="glass-card">
          <h3>🎯 Recommendations</h3>
          {recommendations.map((r, idx) => (
            <div key={idx} className="chip green">{r}</div>
          ))}
        </div>

      </div>

      {/* CHAT */}
      <div className="chat-fab" onClick={() => setChatOpen(!chatOpen)}>🤖</div>

      {chatOpen && (
        <div className="chat-panel">

          <div className="chat-header">
            <h3>AI Assistant</h3>
            <button onClick={() => setChatOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak or type..."
            />

            <button onClick={startVoice}>🎤</button>
            <button onClick={() => sendMessage()}>Send</button>
          </div>

        </div>
      )}

    </motion.div>
  );
}

export default RiskResult;
