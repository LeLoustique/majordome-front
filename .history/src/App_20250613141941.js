import React, { useState } from "react";
import { sendMessageToChatController } from "./api";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour, je suis le Majordome. Posez votre question !" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    // Affiche le message de l'utilisateur
    setMessages(prev => [...prev, { from: "user", text: message }]);
    setLoading(true);

    try {
      const data = await sendMessageToChatController(message);
      setMessages(prev => [...prev, { from: "user", text: message }, { from: "bot", text: data }]);
    } catch (error) {
      setMessages(prev => [...prev, { from: "bot", text: "Erreur : " + error.message }]);
    }

    setMessage("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold">
        🤖 Majordome Chat
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl px-4 py-2 rounded-lg ${
              msg.from === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex border-t border-gray-300">
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Votre message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className={`${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded-r-lg`}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}

export default App;
