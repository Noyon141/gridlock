import { inventory, session } from "@gridlock/db";
import { InferSelectModel } from "drizzle-orm";

export type InventoryItem = InferSelectModel<typeof inventory>;

//Session type but only the token column is needed as type reference

type Session = InferSelectModel<typeof session>;

export type SessionType = Omit<Session, "token">;
