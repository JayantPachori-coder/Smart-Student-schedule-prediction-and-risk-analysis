import { Routes, Route } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";

/* ADMIN PAGES */
import Dashboard from "./pages/Dashboard";
import CreateAssignment from "./pages/CreateAssignment";
import ViewAssignments from "./pages/ViewAssignments";

/* EVALUATION SYSTEM */
import EvaluatePanel from "./pages/Evaluation"; 
import SubmissionList from "./pages/submissionList";
import EvaluateSubmission from "./pages/EvaluateSubmission";

/* SUBMISSIONS OVERVIEW */
import SubmissionDashboard from "./pages/SubmissionDashboard";

/* ROUTE GUARD */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC ROUTE
      ========================= */}
      <Route path="/" element={<Login />} />

      {/* =========================
          ADMIN DASHBOARD
      ========================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ASSIGNMENTS
      ========================= */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateAssignment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view"
        element={
          <ProtectedRoute>
            <ViewAssignments />
          </ProtectedRoute>
        }
      />

      {/* =========================
          EVALUATION FLOW (MAIN)
      ========================= */}

      {/* STEP 1: Assignment List for Teacher */}
      <Route
        path="/evaluate"
        element={
          <ProtectedRoute>
            <EvaluatePanel />
          </ProtectedRoute>
        }
      />

      {/* STEP 2: Submissions for a specific assignment */}
      <Route
        path="/assignment/:id/submissions"
        element={
          <ProtectedRoute>
            <SubmissionList />
          </ProtectedRoute>
        }
      />

      {/* STEP 3: Evaluate single submission */}
      <Route
  path="/evaluate/submission/:id"
  element={<EvaluateSubmission />}
/>

      {/* =========================
          ALL SUBMISSIONS (OPTIONAL)
      ========================= */}
      <Route
        path="/submissions"
        element={
          <ProtectedRoute>
            <SubmissionDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}