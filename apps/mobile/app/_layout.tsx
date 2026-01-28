import { useAuthStore } from "@/features/auth/store";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Slot, useRouter, useSegments } from "expo-router";
import { colorScheme } from "nativewind";
import React, { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import ToastManager from "toastify-react-native";

const RootLayout = () => {
  const { user, isLoading, checkSession } = useAuthStore();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      //User is not logged in and not in auth group
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      //User is logged in and not in auth group
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <>
      <ThemeProvider value={NAV_THEME[colorScheme.get() ?? "light"]}>
        <StatusBar
          barStyle={
            colorScheme.get() === "dark" ? "light-content" : "dark-content"
          }
        />
        <Slot />
        <PortalHost />
        <ToastManager />
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
