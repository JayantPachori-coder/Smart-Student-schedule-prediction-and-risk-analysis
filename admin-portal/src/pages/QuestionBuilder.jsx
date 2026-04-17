import React, { useState } from "react";

function QuestionBuilder() {
  const [type, setType] = useState("mcq");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  const updateOption = (val, index) => {
    const newOpt = [...options];
    newOpt[index] = val;
    setOptions(newOpt);
  };

  const addQuestion = async () => {
    const payload = {
      type,
      question,
      options: type === "mcq" ? options : [],
      correctAnswer: answer
    };

    await fetch("http://localhost:5000/api/tests/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Question Added ✔");
  };

  return (
    <div className="card">
      <h2>🧠 Question Builder</h2>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="mcq">MCQ</option>
        <option value="descriptive">Descriptive</option>
      </select>

      <textarea
        placeholder="Enter question"
        onChange={(e) => setQuestion(e.target.value)}
      />

      {type === "mcq" && (
        <div>
          {options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              onChange={(e) => updateOption(e.target.value, i)}
            />
          ))}
        </div>
      )}

      <input
        placeholder="Correct Answer"
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button className="btn" onClick={addQuestion}>
        Add Question
      </button>
    </div>
  );
}

export default QuestionBuilder;