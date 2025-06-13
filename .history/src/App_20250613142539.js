import React, { useState } from "react";
import { sendMessageToChatController } from "./api";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bonjour, je suis le Majordome. Posez votre question !",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    const now = new Date().toLocaleTimeString();

    setMessages(prev => [
      ...prev,
      { from: "user", text: message, time: now },
    ]);
    setLoading(true);
    setMessage("");

    try {
      const data = await sendMessageToChatController(message);

      const replyTime = new Date().toLocaleTimeString();

      setMessages(prev => [
        ...prev,
        { from: "bot", text: data, time: replyTime },
      ]);
    } catch (error) {
      const errorTime = new Date().toLocaleTimeString();

      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Erreur : " + error.message, time: errorTime },
      ]);
    }

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

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl px-4 py-2 rounded-lg shadow-sm relative text-sm ${
              msg.from === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            <div>{msg.text}</div>
            <div className="absolute bottom-1 right-2 text-xs text-gray-600">
              {msg.time}
            </div>
          </div>
        ))}

        {/* Loader */}
        {loading && (
          <div className="mr-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Le Majordome réfléchit...
          </div>
        )}
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
