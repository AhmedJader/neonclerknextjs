export default function MessageItem({ msg, onDelete }: { msg: any, onDelete: (id: string) => void }) {
    return (
      <li className="p-3 border rounded-lg bg-gray-50">
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
          onClick={() => onDelete(msg.message_id)}
          className="text-red-500 hover:text-red-700 text-sm mt-2"
        >
          Delete
        </button>
      </li>
    )
  }
  