import React from 'react';

function ChatHistory({ history }) {
  return (
    <div>
      {history.map((item, idx) => (
        <div key={idx} className="chat-item">
          <div className="question"><b>Q:</b> {item.question}</div>
          <div className="answer"><b>R:</b> {item.answer}</div>
          {item.sources && item.sources.length > 0 && (
            <ul>
              {item.sources.map((src, i) => (
                <li key={i}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;
