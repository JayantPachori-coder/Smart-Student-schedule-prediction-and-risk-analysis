import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAssignments.css";

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const API = "https://smart-backend-2zlf.onrender.com";

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  // ================= LOAD =================
  const loadAssignments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/api/assignments`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setAssignments(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteAssignment = async (id) => {
    try {
      await axios.delete(`${API}/api/assignments/${id}`);

      setAssignments((prev) =>
        prev.filter((a) => a._id !== id)
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  // ================= OPEN EDIT =================
  const openEdit = (a) => {
    setEditing(a._id);

    setEditForm({
      title: a.title || "",
      description: a.description || "",
      deadline: a.deadline
        ? new Date(a.deadline).toISOString().slice(0, 16)
        : "",
    });
  };

  // ================= UPDATE =================
  const updateAssignment = async () => {
    try {
      const res = await axios.put(
        `${API}/api/assignments/${editing}`,
        {
          title: editForm.title,
          description: editForm.description,
          deadline: new Date(editForm.deadline),
        }
      );

      const updated = res.data?.data;

      setAssignments((prev) =>
        prev.map((a) =>
          a._id === editing ? updated : a
        )
      );

      setEditing(null);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Update failed");
    }
  };

  // ================= FILTER =================
  const filteredAssignments = assignments.filter((a) => {
    if (filter === "all") return true;
    return (a.status || "pending") === filter;
  });

  if (loading) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="view-container">
      <h2>📋 Assignments Dashboard</h2>

      {/* FILTER */}
      <div className="filter-bar">
        {["all", "active", "pending", "closed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="assignments-grid">
        {filteredAssignments.map((a) => (
          <div className="assignment-card" key={a._id}>
            <h3>{a.title}</h3>
            <p>{a.description}</p>

            <div className="meta">
              📅{" "}
              {a.deadline
                ? new Date(a.deadline).toLocaleString()
                : "No deadline"}
            </div>

            <div className="actions">
              <button onClick={() => openEdit(a)}>
                Edit
              </button>

              <button onClick={() => deleteAssignment(a._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Assignment</h3>

            <input
              value={editForm.title}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  title: e.target.value,
                })
              }
              placeholder="Title"
            />

            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />

            <input
              type="datetime-local"
              value={editForm.deadline}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  deadline: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={updateAssignment}>
                Update
              </button>
              <button onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
