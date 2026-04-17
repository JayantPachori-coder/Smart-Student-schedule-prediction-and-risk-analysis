import React, { useState } from "react";

function CreateTest() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState(30);

  const createTest = async () => {
    const res = await fetch("http://localhost:5000/api/tests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: desc, duration })
    });

    const data = await res.json();
    alert("Test Created ✔");
    console.log(data);
  };

  return (
    <div className="card">
      <h2>🧪 Create New Test</h2>

      <input placeholder="Test Title" onChange={(e) => setTitle(e.target.value)} />

      <textarea placeholder="Description" onChange={(e) => setDesc(e.target.value)} />

      <input
        type="number"
        placeholder="Duration (minutes)"
        onChange={(e) => setDuration(e.target.value)}
      />

      <button className="btn" onClick={createTest}>
        Create Test
      </button>
    </div>
  );
}

export default CreateTest;