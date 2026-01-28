import { SignUpForm } from "@/components/auth/sign-up-form";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen = () => {
  return (
    <SafeAreaView className="w-full h-screen flex items-center justify-center px-4">
      <SignUpForm />
    </SafeAreaView>
  );
};

export default SignUpScreen;
