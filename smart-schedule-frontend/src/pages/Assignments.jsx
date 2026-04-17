import React, { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/assignments");

      console.log("API RESPONSE:", res.data);

      // ✅ SAFE DATA HANDLING (FIX MAIN ERROR)
      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.assignments)
          ? res.data.assignments
          : [];

      setAssignments(data);

      // ✅ SAFE forEach replacement
      const map = {};

      data.forEach((a) => {
        if (a?.submissions && user?._id) {
          map[a._id] = a.submissions.some(
            (s) => s.studentId === user._id
          );
        }
      });

      setSubmittedMap(map);
    } catch (err) {
      console.error("Fetch error:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeLeft = (deadline) => {
    if (!deadline) return "No deadline";

    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${h}h ${m}m ${s}s`;
  };

  const submitAssignment = async (e, assignment) => {
    e.preventDefault();

    const file = files[assignment._id];
    if (!file) return alert("Select file first");

    if (!user?._id) return alert("User not found");

    const formData = new FormData();
    formData.append("assignmentId", assignment._id);
    formData.append("studentId", user._id);
    formData.append("studentName", user.name || "");
    formData.append("studentEmail", user.email || "");
    formData.append("file", file);

    try {
      await api.post("/assignments/submit", formData);

      setSubmittedMap((prev) => ({
        ...prev,
        [assignment._id]: true,
      }));

      alert("Submitted Successfully");
    } catch (err) {
      console.error(err);
      alert("Submission Failed");
    }
  };

  if (loading) {
    return <h2 className="title">Loading assignments...</h2>;
  }

  return (
    <div className="page">
      <h1 className="title">📘 Assignments</h1>

      <div className="grid">
        {Array.isArray(assignments) && assignments.length > 0 ? (
          assignments.map((a) => {
            const expired = new Date(a.deadline) < new Date();
            const submitted = submittedMap[a._id];

            return (
              <motion.div
                key={a._id}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>{a.title || "No Title"}</h2>
                <p>{a.description || "No Description"}</p>

                <p className="meta">
                  📅{" "}
                  {a.deadline
                    ? new Date(a.deadline).toDateString()
                    : "No deadline"}
                </p>

                <p className="timer">⏳ {getTimeLeft(a.deadline)}</p>

                {expired ? (
                  <p className="closed">🔒 Closed</p>
                ) : submitted ? (
                  <button className="submittedBtn" disabled>
                    ✅ Submitted
                  </button>
                ) : (
                  <form
                    className="form"
                    onSubmit={(e) => submitAssignment(e, a)}
                  >
                    <input
                      type="file"
                      onChange={(e) =>
                        setFiles((prev) => ({
                          ...prev,
                          [a._id]: e.target.files[0],
                        }))
                      }
                    />

                    <button type="submit">Submit</button>
                  </form>
                )}
              </motion.div>
            );
          })
        ) : (
          <p>No assignments found</p>
        )}
      </div>
    </div>
  );
}

export default Assignments;