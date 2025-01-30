import { db } from '../../../db'
import { UserMessages } from '../../../db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }
  const { messageId } = await req.json()
  try {
    const deletedMessage = await db
      .delete(UserMessages)
      .where(and(eq(UserMessages.message_id, messageId), eq(UserMessages.user_id, userId)))
    return new Response(JSON.stringify(deletedMessage), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete message' }), { status: 500 })
  }
}
// function and is imported from 'drizzle-orm'

