import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const UserMessages = pgTable('user_msg', {
  message_id: uuid('message_id').primaryKey(),  // UUID will be generated manually in the application code
  user_id: text('user_id').notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  message: text('message').notNull(),
  email: text('email').notNull(),
  name: text('name').notNull(),
})

export const UserSignup = pgTable('user_signup', {
  user_id: text('user_id').primaryKey(),  // Use user_id as the primary key
  email: text('email').notNull().unique(),  // Ensure email is unique
  createTs: timestamp('create_ts').defaultNow().notNull(),
});
