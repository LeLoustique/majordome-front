export async function askQuestion(question) {
    const response = await fetch('http://localhost:8080/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return response.json();
  }