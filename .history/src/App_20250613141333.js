import React, { useState } from "react";
import { sendMessageToChatController } from "./api";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const data = await sendMessageToChatController(message);
      setResponse(data);
    } catch (error) {
      setResponse("Erreur : " + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h1 className="text-3xl font-bold underline" >Majordome Chat</h1>
      <textarea
        rows={3}
        style={{ width: "100%" }}
        placeholder="Votre message..."
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button onClick={handleSend} disabled={loading || !message}>
        Envoyer
      </button>
      <div style={{ marginTop: 24 }}>
        <strong>Réponse du Majordome :</strong>
        <div style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{response}</div>
      </div>
    </div>
  );
}

export default App;
