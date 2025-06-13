const BACKEND_URL = "https://sping-ai-majordome.onrender.com";
//const BACKEND_URL = "http://localhost:8080";

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

// export async function sendMessageToChatController(message) {
//   const response = await fetch("http://localhost:8080/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message }),
//   });

//   if (!response.ok) {
//     throw new Error("Erreur serveur");
//   }

//   const data = await response.json();
//   return data.reply || data; // adapte si ta réponse est { reply: "..." }
// }