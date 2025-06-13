import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Accueil from "./pages/Accueil";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Accueil />} />
        <Route path="chat" element={<Chat />} />
      </Route>

      {/* Redirection vers accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
