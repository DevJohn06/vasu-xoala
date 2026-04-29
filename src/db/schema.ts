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

export const pageSettings = sqliteTable('page_settings', {
  pageSlug: text('page_slug').primaryKey(),
  tpsFees: text('tps_fees', { mode: 'json' }).$type<{
    minimumTransactionFee: string;
    additionalLegalTerms: string;
  }>(),
  typFees: text('typ_fees', { mode: 'json' }).$type<{
    clientsCurrencies: string;
    mccCode: string;
    traffic: string;
    processingFees: string;
    fxCalculationText: string;
    fxRates: Array<{ currencies: string; rate: string }>;
  }>(),
});

export const offshoreRates = sqliteTable('offshore_rate', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageSlug: text('page_slug').notNull(),
  category: text('category').notNull(),
  categoryNote: text('category_note'),
  channelCode: text('channel_code').notNull(),
  payIn: text('pay_in'),
  setupFee: text('setup_fee'),
  annualFee: text('annual_fee'),
  otherFees: text('other_fees'),
  rollingReserve: text('rolling_reserve'),
  cbFee: text('cb_fee'),
  refundFee: text('refund_fee'),
  transactionFees: text('transaction_fees'),
  settlementUsdt: text('settlement_usdt'),
  transactionMinMax: text('transaction_min_max'),
  settlementCycle: text('settlement_cycle'),
  velocitiesLimits: text('velocities_limits'),
  whitelistFtdTrusted: text('whitelist_ftd_trusted'),
  processingCurrency: text('processing_currency'),
  geoOpenForProcessing: text('geo_open_for_processing'),
  mccCodes: text('mcc_codes'),
  mid3dsOr2d: text('mid_3ds_or_2d'),
  descriptor: text('descriptor'),
  acceptanceRate: text('acceptance_rate'),
  integrationType: text('integration_type'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

