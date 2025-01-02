import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export type Role = 'admin' | 'user';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewUser = {
  email: string;
  name: string;
  role: Role;
  password: string;
};

// Type guard for role validation
export const isValidRole = (role: string): role is Role => {
  return role === 'admin' || role === 'user';
};
