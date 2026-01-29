import { localInventory } from "../db/schema";

import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export type InventoryItem = InferSelectModel<typeof localInventory>;

export type NewInventoryItem = InferInsertModel<typeof localInventory>;
