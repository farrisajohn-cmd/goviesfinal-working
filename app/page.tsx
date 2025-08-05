'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])

  async function handleSend() {
    const userMessage = { role: 'user', content: input }
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    })

    const botMessage = await res.json()

    setMessages([...messages, userMessage, botMessage])
    setInput('')
  }

  return (
    <div className="p-10">
      <h1 className="mb-4 text-2xl font-bold">Govies AI Chatbot</h1>
      <div className="mb-4">
        {messages.map((m, idx) => (
          <div key={idx}>
            <strong>{m.role === 'user' ? 'You: ' : 'Bot: '}</strong>{m.content}
          </div>
        ))}
      </div>

      <input
        className="border px-2 py-1 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  )
}
