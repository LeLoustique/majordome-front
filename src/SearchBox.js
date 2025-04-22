import React, { useState } from 'react';

function SearchBox({ onAsk, loading }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAsk(input);
      setInput('');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Posez votre question..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !input.trim()}>
        {loading ? 'Recherche...' : 'Envoyer'}
      </button>
    </form>
  );
}

export default SearchBox;