import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import Layout from "./Layout";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Accueil from "./pages/Accueil";

function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Accueil />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
