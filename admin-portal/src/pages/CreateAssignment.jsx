import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CreateAssignment.css";

export default function CreateAssignment() {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  /* =========================
     SAFE TEACHER (NO ERROR)
  ========================= */
  let teacher = {};

  try {
    teacher = JSON.parse(localStorage.getItem("teacher")) || {};
  } catch (e) {
    teacher = {};
  }

  // 🔥 FALLBACK (YOUR PROVIDED DATA)
  if (!teacher?._id) {
    teacher = {
      _id: "69da1965649ddd3832c688f0",
      name: "Admin Teacher",
      email: "jayantpachori2004@gmail.com",
      role: "teacher",
    };
  }

  /* =========================
     LOAD STUDENTS
  ========================= */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!teacher?.email) return;

        const res = await axios.get(
          `http://localhost:5000/api/auth/users?email=${teacher.email}`
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setStudents(data);
      } catch (err) {
        console.log("Student fetch error:", err);
      }
    };

    fetchStudents();
  }, [teacher?.email]);

  /* =========================
     TOGGLE STUDENT
  ========================= */
  const toggleStudent = (stu) => {
    const exists = selectedStudents.some((s) => s._id === stu._id);

    if (exists) {
      setSelectedStudents((prev) =>
        prev.filter((s) => s._id !== stu._id)
      );
    } else {
      setSelectedStudents((prev) => [...prev, stu]);
    }
  };

  /* =========================
     CREATE ASSIGNMENT
  ========================= */
  const createAssignment = async () => {
    try {
      if (!title || !description || !deadline) {
        return alert("Fill all fields");
      }

      if (selectedStudents.length === 0) {
        return alert("Select at least one student");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        deadline: new Date(deadline).toISOString(),

        teacherId: teacher._id,
        teacherEmail: teacher.email,

        assignedTo: selectedStudents.map((s) => s._id),
      };

      console.log("PAYLOAD:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/assignments",
        payload
      );

      if (res.data?.success || res.data?.data) {
        alert("Assignment Created 🚀");

        setTitle("");
        setDescription("");
        setDeadline("");
        setSelectedStudents([]);
      } else {
        alert("Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message || "Error creating assignment"
      );
    }
  };

  return (
    <div className="assignment-container">

      {/* LEFT SIDE */}
      <div className="form-card">
        <h2>📌 Create Assignment</h2>

        <input
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Assignment Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button onClick={createAssignment}>
          Assign to Students 🚀
        </button>

        {/* SELECTED STUDENTS */}
        <div className="selected-box">
          <h3>✅ Selected Students</h3>

          {selectedStudents.length === 0 ? (
            <p>No students selected</p>
          ) : (
            selectedStudents.map((stu) => (
              <div key={stu._id} className="selected-item">
                {stu.firstName || stu.username} ✔
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="student-card">
        <h2>👨‍🎓 Select Students</h2>

        <div className="student-list">
          {Array.isArray(students) &&
            students.map((stu) => {
              const isSelected = selectedStudents.some(
                (s) => s._id === stu._id
              );

              return (
                <div
                  key={stu._id}
                  className={`student-item ${
                    isSelected ? "active" : ""
                  }`}
                  onClick={() => toggleStudent(stu)}
                >
                  <h4>{stu.firstName || stu.username}</h4>
                  <p>{stu.email}</p>

                  {isSelected && <span className="tick">✔</span>}
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}