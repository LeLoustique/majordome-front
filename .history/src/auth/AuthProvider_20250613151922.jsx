import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// --- Helper pour stocker en localStorage ---
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

function getStoredTokens() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

function setStoredTokens(token, refreshToken) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true); // Pour savoir si on a récupéré les tokens

  // Au montage on récupère les tokens en localStorage
  useEffect(() => {
    const { token: t, refreshToken: r } = getStoredTokens();
    setToken(t);
    setRefreshToken(r);
    setLoading(false);
  }, []);

  // Fonction pour login (stocke token + refresh token)
  const login = (newToken, newRefreshToken) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setStoredTokens(newToken, newRefreshToken);
  };

  // Fonction logout (supprime les tokens)
  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setStoredTokens(null, null);
  };

  // Fonction pour refresh token via backend
  const refreshAuthToken = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        logout();
        return null;
      }

      const data = await response.json();
      login(data.token, data.refreshToken);
      return data.token;
    } catch (error) {
      logout();
      return null;
    }
  }, [refreshToken]);

  // Rafraîchir token automatiquement toutes les 14 minutes (par ex)  
  // (le JWT dure souvent 15 min, adapte selon ton backend)
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      refreshAuthToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, refreshAuthToken]);

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, refreshToken, login, logout, isLoggedIn, refreshAuthToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
