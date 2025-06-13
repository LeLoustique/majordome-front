
export async function loginUser(email, password) {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }

  return response.json(); // { accessToken, refreshToken }
}

export async function refreshAccessToken(refreshToken) {
  const response = await fetch("http://localhost:8080/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Impossible de rafraîchir le token");
  }

  return response.json(); // { accessToken, refreshToken }
}

export async function sendMessageToChatController(message, authFetch) {
  const response = await authFetch("http://localhost:8080/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'envoi du message");
  }

  return response.json();
}