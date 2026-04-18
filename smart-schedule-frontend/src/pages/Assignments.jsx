import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api";
import { motion } from "framer-motion";
import "./Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in user safely
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const userId = user?._id;

  // ================= FETCH DATA =================
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);

      if (!userId) {
        console.warn("No user found");
        return;
      }

      const [assignRes, subRes] = await Promise.all([
        api.get("/api/assignments"),
        api.get(`/api/submissions/student/${userId}`),
      ]);

      const assignmentsData = assignRes.data?.data || [];
      const submissionsData = subRes.data?.data || [];

      console.log("Assignments:", assignmentsData);
      console.log("Submissions:", submissionsData);

      setAssignments(assignmentsData);

      // ✅ BUILD SUBMISSION MAP
      const map = {};

      assignmentsData.forEach((a) => {
        map[a._id] = submissionsData.some(
          (s) => s.assignmentId === a._id
        );
      });

      setSubmittedMap(map);

    } catch (err) {
      console.error("Fetch error:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // ================= TIMER =================
  const getTimeLeft = (deadline) => {
    if (!deadline) return "No deadline";

    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return `${h}h ${m}m ${s}s`;
  };

  // ================= SUBMIT =================
  const submitAssignment = async (e, assignment) => {
    e.preventDefault();

    const file = files[assignment._id];

    if (!file) return alert("Select file first");
    if (!userId) return alert("User not found");

    if (submittedMap[assignment._id]) {
      return alert("Already submitted");
    }

    const formData = new FormData();
    formData.append("assignmentId", assignment._id);
    formData.append("studentId", userId);
    formData.append("studentName", user?.name || "");
    formData.append("studentEmail", user?.email || "");
    formData.append("file", file);

    try {
      await api.post("/api/assignments/submit", formData);

      // ✅ update UI instantly
      setSubmittedMap((prev) => ({
        ...prev,
        [assignment._id]: true,
      }));

      alert("Submitted Successfully 🚀");

    } catch (err) {
      console.error("Submit error:", err);
      alert("Submission Failed");
    }
  };

  // ================= UI =================
  if (loading) return <h2 className="title">Loading assignments...</h2>;

  return (
    <div className="page">
      <h1 className="title">📘 Assignments</h1>

      <div className="grid">
        {assignments.length > 0 ? (
          assignments.map((a) => {
            const expired = a.deadline
              ? new Date(a.deadline) < new Date()
              : false;

            const submitted = submittedMap[a._id];

            return (
              <motion.div
                key={a._id}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>{a.title}</h2>
                <p>{a.description}</p>

                <p className="meta">
                  📅{" "}
                  {a.deadline
                    ? new Date(a.deadline).toLocaleString()
                    : "No deadline"}
                </p>

                <p className="timer">
                  ⏳ {getTimeLeft(a.deadline)}
                </p>

                {/* STATUS */}
                {expired ? (
                  <p className="closed">🔒 Closed</p>
                ) : submitted ? (
                  <button disabled>✅ Submitted</button>
                ) : (
                  <form onSubmit={(e) => submitAssignment(e, a)}>
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
