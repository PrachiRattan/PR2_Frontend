import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Procurement from "./pages/Procurement";
import Scenarios from "./pages/Scenarios";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
