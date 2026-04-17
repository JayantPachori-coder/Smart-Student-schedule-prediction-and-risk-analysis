import React, { useState, useEffect } from "react";
import { generateSchedule, getSchedules } from "../services/schedule";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./SchedulePrediction.css";

const SchedulePrediction = () => {

  const userId = "test123";
  const token = localStorage.getItem("token"); // 🔥 FIX ADDED

  const [subjects, setSubjects] = useState([
    { name: "", difficulty: "", performance: "", hours: "" }
  ]);

  const [predictedSchedule, setPredictedSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChange = (idx, field, value) => {
    const updated = [...subjects];
    updated[idx][field] = value;
    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { name: "", difficulty: "", performance: "", hours: "" }
    ]);
  };

  const removeSubject = (idx) => {
    const updated = subjects.filter((_, i) => i !== idx);
    setSubjects(updated);
  };

  // -----------------------------
  // GENERATE SCHEDULE (FIXED)
  // -----------------------------
  const handleGenerate = async () => {
    setLoading(true);

    try {
      const formattedSubjects = subjects
        .filter(sub => sub.name.trim() !== "")
        .map(sub => ({
          name: sub.name,
          difficulty: Number(sub.difficulty) || 1,
          performance: Number(sub.performance) || 1,
          hours: Number(sub.hours) || 1
        }));

      if (formattedSubjects.length === 0) {
        alert("Please add at least one valid subject ❌");
        setLoading(false);
        return;
      }

      const res = await generateSchedule(
        { subjects: formattedSubjects },
        {
          headers: {
            Authorization: `Bearer ${token}` // 🔥 FIX IMPORTANT
          }
        }
      );

      console.log("API RESPONSE:", res.data);

      if (res.data?.schedule) {
        setPredictedSchedule(res.data.schedule);
      } else {
        alert("No schedule generated ❌");
      }

      fetchHistory();

    } catch (err) {
      console.error("FRONTEND ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Error generating schedule ❌");
    }

    setLoading(false);
  };

  // -----------------------------
  // HISTORY (FIXED)
  // -----------------------------
  const fetchHistory = async () => {
    try {
      const res = await getSchedules(token); // 🔥 FIX
      setHistory(res.data || []);
    } catch (err) {
      console.error("HISTORY ERROR:", err.response?.data || err.message);
    }
  };

  // -----------------------------
  // PDF
  // -----------------------------
  const downloadPDF = async () => {
    const element = document.getElementById("schedule-cards");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("SmartSchedule.pdf");
  };

  return (
    <div className="schedule-page">
      <h1>Smart Schedule Predictor</h1>

      <div className="tile-container">
        {subjects.map((sub, idx) => (
          <div className="subject-row" key={idx}>

            <input
              placeholder="Subject Name"
              value={sub.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
            />

            <input
              type="number"
              placeholder="Difficulty (1-100)"
              value={sub.difficulty}
              onChange={(e) => handleChange(idx, "difficulty", e.target.value)}
            />

            <input
              type="number"
              placeholder="Performance (1-100)"
              value={sub.performance}
              onChange={(e) => handleChange(idx, "performance", e.target.value)}
            />

            <input
              type="number"
              placeholder="Hours"
              value={sub.hours}
              onChange={(e) => handleChange(idx, "hours", e.target.value)}
            />

            {subjects.length > 1 && (
              <button onClick={() => removeSubject(idx)}>❌</button>
            )}
          </div>
        ))}

        <div className="buttons">
          <button onClick={addSubject}>Add Subject</button>

          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Schedule"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {predictedSchedule.length > 0 && (
        <div className="schedule-cards-container">
          <div id="schedule-cards" className="schedule-cards">

            {["Morning", "Afternoon", "Evening"].map((block) => (
              <div className="time-block-card" key={block}>
                <h2>{block}</h2>

                {predictedSchedule.map((sub, idx) =>
                  (sub.blockHours || [])
                    .filter((b) => b.timeBlock === block)
                    .map((b, j) => (
                      <div className="subject-card" key={`${idx}-${j}`}>
                        <span>{sub.name}</span>
                        <span>{b.hours} hrs</span>
                      </div>
                    ))
                )}

              </div>
            ))}

          </div>

          <button className="download-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      )}

      {/* HISTORY */}
      <h2>Past Schedules</h2>

      <div>
        {history.length === 0 && <p>No history available</p>}

        {history.map((sch, idx) => (
          <div key={idx}>
            <strong>{new Date(sch.createdAt).toLocaleString()}</strong>

            {(sch.subjects || []).map((sub, i) => (
              <div key={i}>
                {sub.name} - {sub.predictedHours} hrs
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePrediction;