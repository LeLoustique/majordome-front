const BACKEND_URL = "https://sping-ai-majordome.onrender.com";
//const BACKEND_URL = "http://localhost:8080";

export async function loginUser(email, password) {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }

  return response.json(); // { token: "JWT_TOKEN" }
}

export async function sendMessageToChatController(message) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: message
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la communication avec le backend");
  }

  return response.text();
}

// export async function sendMessageToChatController(message, token) {
//   const response = await fetch(`${API_URL}/chat`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ message }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Erreur lors de l'envoi du message");
//   }

//   return response.json(); // Supposons que le backend renvoie { response: "..." }
// }