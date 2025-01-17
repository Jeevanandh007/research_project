import {
  pgTable,
  integer,
  timestamp,
  numeric,
  varchar,
  unique,
  serial,
  pgSequence,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const machineIdSeq = pgSequence('machine_id_seq', {
  startWith: '1',
  increment: '1',
  minValue: '1',
  maxValue: '9223372036854775807',
  cache: '1',
  cycle: false,
});

export const machineData = pgTable('machine_data', {
  id: integer()
    .default(sql`nextval('machine_id_seq'::regclass)`)
    .primaryKey()
    .notNull(),
  timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  airTemperature: numeric('air_temperature').notNull(),
  processTemperature: numeric('process_temperature').notNull(),
  rotationalSpeed: integer('rotational_speed').notNull(),
  torque: numeric().notNull(),
  toolWear: integer('tool_wear').notNull(),
  machineStatus: integer('machine_status').notNull(),
  predictionStatus: integer('prediction_status').notNull(),
  productId: varchar('product_id', { length: 50 }).notNull(),
  type: integer().notNull(),
  twf: integer().notNull(),
  hdf: integer().notNull(),
  pwf: integer().notNull(),
  osf: integer().notNull(),
  rnf: integer().notNull(),
});

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    email: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 50 }).default('user').notNull(),
    password: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique('users_email_unique').on(table.email)]
);

export type MachineData = typeof machineData.$inferSelect;
export type NewMachineData = typeof machineData.$inferInsert;
export type NewUsers = typeof users.$inferInsert;
