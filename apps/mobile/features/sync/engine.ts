import { db } from "@/core/db/client";
import { localInventory } from "@/core/db/schema";
import { authClient } from "@/lib/authClient";
import { eq } from "drizzle-orm";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.0.198:3000";

export const syncEngine = {
  pushChanges: async () => {
    const unSyncedItems = await db
      .select()
      .from(localInventory)
      .where(eq(localInventory.synced, false));

    if (unSyncedItems.length === 0) return { count: 0 };

    console.log(
      `Syncing ${unSyncedItems.length} items to server:`,
      unSyncedItems,
    );

    const session = await authClient.getSession();

    if (!session.data || !session.data?.user) {
      throw new Error("No valid session found. Cannot sync data.");
    }

    try {
      const response = await fetch(`${API_URL}/api/inventory/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.session.token}`,
        },
        body: JSON.stringify({ items: unSyncedItems }),
      });

      if (!response.ok) {
        console.log(
          "Failed to sync data: ENGINE.TS",
          response.status,
          response.statusText,
        );

        throw new Error(`Server responded with status ${response.status}`);
      }

      for (const item of unSyncedItems) {
        await db
          .update(localInventory)
          .set({ synced: true, action: null })
          .where(eq(localInventory.id, item.id));
      }
      console.log(`Successfully synced ${unSyncedItems.length} items.`);

      return { count: unSyncedItems.length };
    } catch (error) {
      console.error("Error during sync:", error);
      throw error;
    }
  },
};
