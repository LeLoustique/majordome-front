const BACKEND_URL = "https://sping-ai-majordome.onrender.com"; 

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