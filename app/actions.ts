'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { UserMessages } from './db/schema'
import { db } from './db'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function createUserMessage(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('User not found')

  // Fetch user details from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress || 'Unknown'
  const name = user.firstName || user.username || 'Unknown'

  const message = formData.get('message') as string

  const messageId = uuidv4() // Generate the UUID

  await db.insert(UserMessages).values({
    message_id: messageId, // Use the generated UUID here
    user_id: userId,
    message,
    email,
    name,
  })
}


export async function deleteUserMessage(formData: FormData) {

  const messageId = formData.get('messageId') as string;

  // Log the messageId for debugging
  console.log('Deleted messageId:', messageId);

  // Ensure messageId is a valid UUID before proceeding
  if (!messageId || !isValidUUID(messageId)) {
    console.error('Invalid messageId format:', messageId);
    throw new Error('Invalid messageId format');
  }

  await db.delete(UserMessages).where(eq(UserMessages.message_id, messageId));
}

// Helper function to check if the provided string is a valid UUID
function isValidUUID(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
