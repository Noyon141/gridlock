import { authClient } from "@/lib/authClient";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;

  signOut: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  checkSession: async () => {
    try {
      const { data } = await authClient.getSession();

      set({ user: data?.user || null, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },
  signOut: async () => {
    await authClient.signOut();
    set({ user: null });
  },
}));
