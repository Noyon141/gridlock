import { db } from "@/core/db/client";
import { localInventory } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import * as Crypto from "expo-crypto";

export const inventoryRepo = {
  //READ LOCAL INVENTORY TABLE USING DRIZZLE ORM
  getAll: () => {
    return db.select().from(localInventory).orderBy(localInventory.updatedAt);
  },
  //CREATE LOCAL INVENTORY TABLE USING DRIZZLE ORM

  create: async (name: string, sku: string, quantity: number) => {
    const id = Crypto.randomUUID();

    await db.insert(localInventory).values({
      id,
      name,
      sku,
      quantity,
      synced: false, //NOT SYNCED
      action: "create",
      updatedAt: new Date(),
    });

    return id;
  },

  //UPDATE LOCAL INVENTORY TABLE USING DRIZZLE ORM
  markSynced: async (id: string) => {
    await db
      .update(localInventory)
      .set({
        synced: true,
        action: null,
      })
      .where(eq(localInventory.id, id));
  },
};
