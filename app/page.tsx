'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'Hi! I can help you with FHA loan quotes. Ask me anything.' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.reply }]);
    setInput('');
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>govies.com FHA Assistant</h1>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.role}:</strong> {msg.content}</div>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}