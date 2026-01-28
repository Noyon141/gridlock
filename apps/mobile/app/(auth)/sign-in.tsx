import { SignInForm } from "@/components/auth/sign-in-form";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

const SignInScreen = () => {
  return (
    <SafeAreaView className="w-full h-screen flex items-center justify-center px-4">
      <SignInForm />
    </SafeAreaView>
  );
};

export default SignInScreen;
