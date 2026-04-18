import React, { useState, useEffect, useCallback } from "react";
import { generateSchedule, getSchedules } from "../services/schedule";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./SchedulePrediction.css";

const SchedulePrediction = () => {
  const token = localStorage.getItem("token");

  const [subjects, setSubjects] = useState([
    { name: "", difficulty: "", performance: "", hours: "" }
  ]);

  const [predictedSchedule, setPredictedSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // -----------------------------
  // FETCH HISTORY
  // -----------------------------
  const fetchHistory = useCallback(async () => {
    try {
      const res = await getSchedules(token);
      setHistory(res.data || []);
    } catch (err) {
      console.error("HISTORY ERROR:", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // -----------------------------
  // HANDLE INPUT CHANGE
  // -----------------------------
  const handleChange = (idx, field, value) => {
    const updated = [...subjects];

    if (["difficulty", "performance", "hours"].includes(field)) {
      // ✅ allow only non-negative integers
      if (value === "" || /^\d*$/.test(value)) {
        updated[idx][field] = value;
      }
    } else {
      updated[idx][field] = value;
    }

    setSubjects(updated);
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { name: "", difficulty: "", performance: "", hours: "" }
    ]);
  };

  const removeSubject = (idx) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  // -----------------------------
  // GENERATE SCHEDULE
  // -----------------------------
  const handleGenerate = async () => {
    setLoading(true);

    try {
      const formattedSubjects = subjects
        .filter(sub => sub.name.trim() !== "")
        .map(sub => ({
          name: sub.name,
          difficulty: sub.difficulty === "" ? 0 : Number(sub.difficulty),
          performance: sub.performance === "" ? 0 : Number(sub.performance),
          hours: sub.hours === "" ? 0 : Number(sub.hours)
        }));

      if (formattedSubjects.length === 0) {
        alert("Please add at least one valid subject ❌");
        setLoading(false);
        return;
      }

      // ✅ extra safety (no negatives)
      if (formattedSubjects.some(sub =>
        sub.difficulty < 0 ||
        sub.performance < 0 ||
        sub.hours < 0
      )) {
        alert("Values cannot be negative ❌");
        setLoading(false);
        return;
      }

      const res = await generateSchedule(
        { subjects: formattedSubjects },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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
  // PDF DOWNLOAD
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
              type="text"
              placeholder="Difficulty (0-100)"
              value={sub.difficulty}
              onChange={(e) => handleChange(idx, "difficulty", e.target.value)}
            />

            <input
              type="text"
              placeholder="Performance (0-100)"
              value={sub.performance}
              onChange={(e) => handleChange(idx, "performance", e.target.value)}
            />

            <input
              type="text"
              placeholder="Hours (0+)"
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
