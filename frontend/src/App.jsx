import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./pages/AdminRoute";
import LodgeGrievance from "./pages/LodgeGrievance";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/grievance/new" element={<LodgeGrievance />} />
      </Routes>
    </Router>
  );
}