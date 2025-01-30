'use client'

import { useState, useEffect } from 'react'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'
import SignupLogger from './components/SignupLogger'

interface Message {
  message_id: string
  user_id: string
  createTs: Date
  message: string
  email: string
  name: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/messages')
      const data: Message[] = await res.json() 
      setMessages(data)
    }
    fetchMessages()
  }, [])

  const handleDeleteMessage = async (messageId: string) => {
    const res = await fetch('/api/messages/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId }),
    })

    if (res.ok) {
      setMessages((prevMessages: Message[]) =>
        prevMessages.filter((msg) => msg.message_id !== messageId)
      )
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100 p-6">
      <SignupLogger />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Neon + Clerk Example
          </h1>
          <MessageForm onMessageCreated={(newMessage) => setMessages([newMessage, ...messages])} />
        </div>
      </div>
      <MessageList messages={messages} onDelete={handleDeleteMessage} />
    </main>
  )
}
