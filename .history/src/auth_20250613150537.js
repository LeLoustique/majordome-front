import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8080/api";

function getTokensFromStorage() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
}

function saveTokensToStorage(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokensFromStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Fonction pour refresh le token en appelant backend
async function fetchNewAccessToken(refreshToken) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Impossible de rafraîchir le token");
  }

  return response.json(); // { accessToken: "...", refreshToken: "..." }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au montage, on charge les tokens du localStorage
  useEffect(() => {
    const { accessToken, refreshToken } = getTokensFromStorage();
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setLoading(false);
  }, []);

  // Fonction login : on stocke tokens et états
  const login = (newAccessToken, newRefreshToken) => {
    saveTokensToStorage(newAccessToken, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  // Fonction logout : on supprime tout
  const logout = () => {
    clearTokensFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Fonction pour refresh token avec mise à jour d’état
  const refreshTokens = useCallback(async () => {
    if (!refreshToken) throw new Error("Pas de refresh token");
    const data = await fetchNewAccessToken(refreshToken);
    login(data.accessToken, data.refreshToken);
    return data.accessToken;
  }, [refreshToken]);

  // On peut ajouter une fonction qui exécute un fetch avec refresh auto du token si 401
  const authFetch = useCallback(
    async (url, options = {}) => {
      if (!options.headers) options.headers = {};
      options.headers.Authorization = `Bearer ${accessToken}`;

      let response = await fetch(url, options);

      if (response.status === 401) {
        try {
          const newAccessToken = await refreshTokens();
          options.headers.Authorization = `Bearer ${newAccessToken}`;
          response = await fetch(url, options);
        } catch (e) {
          logout();
          throw e;
        }
      }

      return response;
    },
    [accessToken, refreshTokens]
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        isLoggedIn: !!accessToken,
        authFetch,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}
