import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// --- Helper pour stocker en localStorage ---
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

// Mode bypass pour dev sans backend
const BYPASS_AUTH = true;

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
  const [token, setToken] = useState(BYPASS_AUTH ? "mock-token-123" : null);
  const [refreshToken, setRefreshToken] = useState(BYPASS_AUTH ? "mock-refresh-token-456" : null);
  const [loading, setLoading] = useState(true); // Pour savoir si on a récupéré les tokens

  // Au montage on récupère les tokens en localStorage (sauf bypass)
  useEffect(() => {
    if (BYPASS_AUTH) {
      setLoading(false);
      return;
    }
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

  // Fonction pour refresh token via backend ou bypass
  const refreshAuthToken = useCallback(async () => {
    if (BYPASS_AUTH) {
      // En mode bypass, retourne juste le token factice
      return token;
    }

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
  }, [refreshToken, token]);

  // Rafraîchir token automatiquement toutes les 14 minutes (par ex)
  useEffect(() => {
    if (BYPASS_AUTH) return; // pas besoin en bypass

    if (!token) return;

    const interval = setInterval(() => {
      refreshAuthToken();
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token, refreshAuthToken]);

  // Fonction authFetch : wrapper fetch avec auth et refresh token
  const authFetch = useCallback(
    async (url, options = {}) => {
      if (BYPASS_AUTH) {
        // Simuler réponse pour test local sans backend
        if (url.endsWith("/chat/send")) {
          return { response: "Réponse simulée du Majordome (mode bypass)" };
        }
        // Retour vide ou générique pour autres routes
        return {};
      }

      // Ajout du token dans headers
      if (!options.headers) options.headers = {};
      options.headers["Authorization"] = `Bearer ${token}`;

      let response = await fetch(url, options);

      if (response.status === 401) {
        // Token expiré, tenter refresh
        const newToken = await refreshAuthToken();
        if (!newToken) throw new Error("Non autorisé");

        // Refaire la requête avec nouveau token
        options.headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(url, options);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erreur réseau");
      }

      return await response.json();
    },
    [token, refreshAuthToken]
  );

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        login,
        logout,
        isLoggedIn,
        refreshAuthToken,
        loading,
        authFetch,
      }}
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
