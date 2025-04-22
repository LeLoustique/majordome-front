import React, { useState } from 'react';
import { askQuestion } from './api';
import SearchBox from './SearchBox';
import ChatHistory from './ChatHistory';

function App() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (question) => {
    setLoading(true);
    const result = await askQuestion(question);
    setHistory([
      ...history,
      { question, answer: result.answer, sources: result.sources }
    ]);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Majordome</h1>
      <SearchBox onAsk={handleAsk} loading={loading} />
      <ChatHistory history={history} />
    </div>
  );
}

export default App;
