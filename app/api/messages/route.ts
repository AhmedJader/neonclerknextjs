import { db } from '../../db'
import { UserMessages } from '../../db/schema'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { v4 as uuidv4 } from 'uuid'
import { eq, desc } from 'drizzle-orm'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { message } = await req.json()
  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 })
  }

  try {
    // Fetch user details from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const email = user.emailAddresses[0]?.emailAddress || 'user@example.com'
    const name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.firstName || user.lastName || 'User'

    // Insert into database
    const newMessage = await db
      .insert(UserMessages)
      .values({
        message_id: uuidv4(),
        user_id: userId,
        message,
        email,
        name,
        createTs: new Date(),
      })
      .returning()

    return new Response(JSON.stringify(newMessage[0]), { status: 200 })
  } catch (error) {
    console.error('Error inserting message:', error)
    return new Response(JSON.stringify({ error: 'Failed to create message' }), { status: 500 })
  }
}

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const messages = await db
      .select()
      .from(UserMessages)
      .where(eq(UserMessages.user_id, userId))
      .orderBy(desc(UserMessages.createTs))

    return new Response(JSON.stringify(messages), { status: 200 })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), { status: 500 })
  }
}
