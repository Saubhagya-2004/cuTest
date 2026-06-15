import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import Register from "./components/register";
import { useAuth } from "./hooks/useAuth";

function LoadingScreen() {
  return <div className="p-6 text-center">Loading...</div>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          path="/login"
        />
        <Route
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
          path="/register"
        />
        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
      </Routes>
    </BrowserRouter>
  );
}
