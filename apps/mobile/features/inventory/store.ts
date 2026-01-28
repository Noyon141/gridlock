import { create } from "zustand";
import { inventoryRepo } from "./repository";

interface InventoryState {
  items: unknown[];

  refresh: () => Promise<void>;
  addItem: (name: string, sku: string, quantity: number) => Promise<void>;
}
export const useInventoryStore = create<InventoryState>((set) => ({
  items: [],
  refresh: async () => {
    const data = await inventoryRepo.getAll();

    set({ items: data });
  },
  addItem: async (name: string, sku: string, quantity: number) => {
    await inventoryRepo.create(name, sku, quantity);

    const data = await inventoryRepo.getAll();

    set({ items: data });
  },

  markSynced: async (id: string) => {
    await inventoryRepo.markSynced(id);

    const data = await inventoryRepo.getAll();

    set({ items: data });
  },
}));
