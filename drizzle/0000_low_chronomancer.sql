CREATE TABLE `kv_store` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text(32) NOT NULL,
	`value` text NOT NULL,
	`ttl` integer,
	`tenant_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kv_store_key_unique` ON `kv_store` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `kv_store_tenant_id_unique` ON `kv_store` (`tenant_id`);