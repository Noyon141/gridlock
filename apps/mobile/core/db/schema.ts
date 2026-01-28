import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const localInventory = sqliteTable("inventory", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull().default(0),

  //Sync fields

  synced: integer("synced", { mode: "boolean" }).notNull().default(true), // 1 OR 0

  action: text("action"), //FOR WHAT IS HAPPENING WHILE OFFLINE (CREATE, UPDATE, DELETE)

  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
