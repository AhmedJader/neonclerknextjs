'use client'

import { useState, useEffect } from 'react'
import { useSignUp, useUser } from '@clerk/nextjs'

interface Message {
  message_id: string
  user_id: string
  createTs: Date
  message: string
  email: string
  name: string
}

export default function Home() {
  const { user, isLoaded } = useUser()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch('/api/messages')
      const data = await res.json()

      console.log(data)
      setMessages(data)
    }

    fetchMessages()
  }, [])

  // Trigger /api/signup after the user is authenticated
  useEffect(() => {
    if (user && user.id) {
      const signupUser = async () => {
        const response = await fetch('/api/signup')
        if (response.ok) {
          console.log('User signup logged in DB')
        } else {
          console.error('Error logging user signup')
        }
      }

      signupUser()
    }
  }, [user])

  const handleCreateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const message = formData.get('message')

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (res.ok) {
      const newMessage = await res.json()
      setMessages((prevMessages) => [newMessage, ...prevMessages])
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    const res = await fetch('/api/messages/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageId }),
    })

    if (res.ok) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.message_id !== messageId)
      )
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100 p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Neon + Clerk Example
          </h1>

          <form onSubmit={handleCreateMessage} className="flex flex-col gap-3">
            <input
              className="text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              type="text"
              name="message"
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
        </div>
      </div>

      <aside className="w-80 bg-white p-6 rounded-lg shadow-lg ml-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Messages</h2>

        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg.message_id} className="p-3 border rounded-lg bg-gray-50">
                <p className="text-gray-700">{msg.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(msg.createTs).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>

                <button
                  onClick={() => handleDeleteMessage(msg.message_id)}
                  className="text-red-500 hover:text-red-700 text-sm mt-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </aside>
    </main>
  )
}
