CREATE TABLE `admin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_username_unique` ON `admin` (`username`);--> statement-breakpoint
CREATE TABLE `crypto_rate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`tier` text,
	`fee` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offshore_rate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`category` text NOT NULL,
	`category_note` text,
	`channel_code` text NOT NULL,
	`pay_in` text,
	`setup_fee` text,
	`annual_fee` text,
	`other_fees` text,
	`rolling_reserve` text,
	`cb_fee` text,
	`refund_fee` text,
	`transaction_fees` text,
	`settlement_usdt` text,
	`transaction_min_max` text,
	`settlement_cycle` text,
	`velocities_limits` text,
	`whitelist_ftd_trusted` text,
	`processing_currency` text,
	`geo_open_for_processing` text,
	`mcc_codes` text,
	`mid_3ds_or_2d` text,
	`descriptor` text,
	`acceptance_rate` text,
	`integration_type` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_settings` (
	`page_slug` text PRIMARY KEY NOT NULL,
	`tps_fees` text,
	`typ_fees` text
);
--> statement-breakpoint
CREATE TABLE `rate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`country` text NOT NULL,
	`currency` text NOT NULL,
	`channel_code` text NOT NULL,
	`payment_method` text NOT NULL,
	`verticals` text,
	`deposit` text,
	`deposit_limit` text,
	`withdrawal` text,
	`withdrawal_limit` text,
	`other_fees_notes` text,
	`settlement_terms` text,
	`settlement_cycle` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`pin` text NOT NULL,
	`type` text DEFAULT 'USER' NOT NULL,
	`sanity_page_slug` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_pin_unique` ON `user` (`pin`);