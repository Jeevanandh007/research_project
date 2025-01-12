import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

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

export const machineData = pgTable('machine_data', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  type: varchar('type', { length: 1 }).notNull(),
  airTemperature: numeric('air_temperature').notNull(),
  processTemperature: numeric('process_temperature').notNull(),
  rotationalSpeed: integer('rotational_speed').notNull(),
  torque: numeric('torque').notNull(),
  toolWear: integer('tool_wear').notNull(),
  twf: boolean('twf').notNull(), // Tool wear failure
  hdf: boolean('hdf').notNull(), // Heat dissipation failure
  pwf: boolean('pwf').notNull(), // Power failure
  osf: boolean('osf').notNull(), // Overstrain failure
  rnf: boolean('rnf').notNull(), // Random failure
  machineStatus: boolean('machine_status').notNull(),
  predictionStatus: varchar('prediction_status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type MachineData = typeof machineData.$inferSelect;
export type NewMachineData = typeof machineData.$inferInsert;
