import { inventory } from "@gridlock/db";
import { InferSelectModel } from "drizzle-orm";

export type InventoryItem = InferSelectModel<typeof inventory>;
