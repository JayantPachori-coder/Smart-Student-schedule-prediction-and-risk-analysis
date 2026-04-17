import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProctoredTest.css';

const ProctoredTest = () => {
  const [answers, setAnswers] = useState({});
  const [cameraStatus, setCameraStatus] = useState("Checking...");
  const [isDevMode] = useState(true); // 👈 Toggle for development phase

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setCameraStatus("Camera Active ✅"))
      .catch(() => setCameraStatus("Camera Blocked ❌"));
  }, []);

  const questions = [
    { id: 1, q: "What is React?", options: ["Library", "Framework", "Language"] },
    { id: 2, q: "What is MongoDB?", options: ["SQL DB", "NoSQL DB", "API"] }
  ];

  const handleChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    alert("Test Submitted!");
  };

  return (
    <div className="test-container">
      

      <div className="test-content">
        <h2>Proctored Test</h2>

        {/* 🚧 DEVELOPMENT BANNER */}
        {isDevMode && (
          <div className="dev-banner">
            🚧 This feature is currently under development.  
            Some functionalities may not work properly.
          </div>
        )}

        <p className="camera-status">{cameraStatus}</p>

        {/* Disable interaction if in dev mode */}
        <div className={isDevMode ? "disabled-section" : ""}>
          {questions.map((q) => (
            <div key={q.id} className="question-box">
              <p>{q.q}</p>
              {q.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={q.id}
                    disabled={isDevMode} // 👈 disable in dev phase
                    onChange={() => handleChange(q.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button onClick={handleSubmit} disabled={isDevMode}>
            Submit Test
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProctoredTest;