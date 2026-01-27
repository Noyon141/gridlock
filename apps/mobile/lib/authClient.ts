import { createAuthClient } from "better-auth/react";
import { Platform } from "react-native";

// 1. Determine the Base URL dynamically
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL)
    return `${process.env.EXPO_PUBLIC_API_URL}`;
  // Fallback for local dev
  if (Platform.OS === "android") return "http://10.0.2.2:3000";
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  // 2. We use a custom fetch implementation to handle session tokens via Headers
  // if cookies are unreliable in your specific Expo environment.
  // For now, Better Auth v1 handles this well, but let's be safe.
  fetchOptions: {
    onError: async (ctx) => {
      if (ctx.response.status === 401) {
        // Handle global logout triggers here
        console.log("Unauthorized - Token likely expired");
      }
    },
  },
});

// Helper to save token manually if needed (BetterAuth handles cookies mostly,
// but for mobile we often prefer Bearer tokens. We will configure this later
// if cookie-based auth proves unstable on your device).
