import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>govies fha chatbot</h1>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <br />
      <button onClick={sendMessage}>send</button>
      <pre>{response}</pre>
    </div>
  );
}
