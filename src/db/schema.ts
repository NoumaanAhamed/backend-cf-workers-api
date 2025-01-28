import { int, sqliteTable, text, } from "drizzle-orm/sqlite-core";

export const kvStore = sqliteTable("kv_store", {
    id: int().primaryKey({ autoIncrement: true }),
    key: text({ length: 32 }).notNull().unique(),
    value: text({ mode: "json" }).notNull(),
    ttl: int(),
    tenant_id: text().notNull(),
});     
