import React, { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Salut ! Que puis-je faire pour toi ?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    // Ajoute ton message
    setMessages([...messages, { from: 'user', text: input }]);

    // Simule une réponse du bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'user', text: input },
        { from: 'bot', text: `Tu as dit : "${input}"` },
      ]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 text-xl font-semibold">
        ChatBot
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.from === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-300 text-black'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Écris un message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}