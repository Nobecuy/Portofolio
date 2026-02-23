import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../firebase";

// User Pages
import OnePage from "../pages/user/OnePage";

// Admin Pages
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import ProjectsManager from "../pages/admin/ProjectsManager";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return user ? children : <Navigate to="/admin/login" />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Single Page Portfolio */}
        <Route path="/" element={<OnePage />} />
        
        {/* Redirect old routes to home */}
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/about" element={<Navigate to="/" />} />
        <Route path="/progress" element={<Navigate to="/" />} />
        <Route path="/projects" element={<Navigate to="/" />} />
        <Route path="/skills" element={<Navigate to="/" />} />
        <Route path="/experience" element={<Navigate to="/" />} />
        <Route path="/contact" element={<Navigate to="/" />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ProjectsManager />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
