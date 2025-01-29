import { db } from '../../db';
import { UserSignup } from '../../db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm'

export async function GET() {
  // Authenticate the user using Clerk
  const { userId } = await auth();

  if (!userId) {
    console.error('Unauthorized request');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    // Fetch user details from Clerk API
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY?.trim()}`,
      },
    });

    const user = await response.json();

    if (!response.ok) {
      console.error(`Clerk API Error: ${user.message}`);
      return new Response(JSON.stringify({ error: `Clerk API Error: ${user.message}` }), { status: response.status });
    }

    if (!user || !user.email_addresses?.[0]?.email_address) {
      console.error('User email not found');
      return new Response(JSON.stringify({ error: 'User email not found' }), { status: 400 });
    }

    const email = user.email_addresses[0].email_address;

    // Check if the user already exists in the database
    const userExists = await db
      .select()
      .from(UserSignup)
      .where(eq(UserSignup.user_id, userId))
      .execute();

    if (userExists.length === 0) {
      // Insert the user if they do not exist
      await db.insert(UserSignup).values({
        user_id: userId,
        email,
        createTs: new Date(),
      });
      console.log('User signup logged in DB');
    } else {
      console.log('User already signed up');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error during signup process:', error);
    return new Response(JSON.stringify({ error: 'Failed to store user signup' }), { status: 500 });
  }
}
