'use client'
import { useState } from 'react'
import { Message } from '../../app/type' // Import Message type

export default function MessageForm({ onMessageCreated }: { onMessageCreated: (message: Message) => void }) {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (res.ok) {
      const newMessage: Message = await res.json() // Enforce the type
      onMessageCreated(newMessage)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        className="text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
      >
        Save Message
      </button>
    </form>
  )
}
