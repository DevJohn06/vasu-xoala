import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const admins = sqliteTable('admin', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const USER_TYPES = ['USER', 'MERCHANT', 'RESELLER', 'MOR', 'SPECIAL'] as const;
export type UserType = typeof USER_TYPES[number];

export const users = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  pin: text('pin').notNull().unique(),
  type: text('type').notNull().default('USER'), // 'USER' | 'MERCHANT' | 'RESELLER' | 'MOR' | 'SPECIAL'
  pageSlug: text('sanity_page_slug'),
  status: text('status').notNull().default('active'), // 'active' | 'disabled'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const rates = sqliteTable('rate', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageSlug: text('page_slug').notNull(),
  country: text('country').notNull(),
  currency: text('currency').notNull(),
  channelCode: text('channel_code').notNull(),
  paymentMethod: text('payment_method').notNull(),
  verticals: text('verticals'),
  deposit: text('deposit'),
  depositLimit: text('deposit_limit'),
  withdrawal: text('withdrawal'),
  withdrawalLimit: text('withdrawal_limit'),
  otherFeesNotes: text('other_fees_notes'),
  settlementTerms: text('settlement_terms'),
  settlementCycle: text('settlement_cycle'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});
