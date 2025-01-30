import MessageItem from './MessageItem'
import { Message } from '../../app/type' // Import Message type

export default function MessageList({ messages, onDelete }: { messages: Message[], onDelete: (id: string) => void }) {
  return (
    <aside className="w-80 bg-white p-6 rounded-lg shadow-lg ml-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Messages</h2>
      {messages.length > 0 ? (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <MessageItem key={msg.message_id} msg={msg} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No messages yet.</p>
      )}
    </aside>
  )
}
