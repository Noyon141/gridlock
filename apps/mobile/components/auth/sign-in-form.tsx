import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/features/auth/store";
import { authClient } from "@/lib/authClient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, type TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

export function SignInForm() {
  const passwordInputRef = useRef<TextInput>(null);

  const router = useRouter();

  //STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { checkSession } = useAuthStore();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => {
            setLoading(true);
            Toast.info("Signing in...");
          },
          onSuccess: async () => {
            Toast.success("Signed in successfully!");
            setLoading(false);
            await checkSession();
          },

          onError: (error) => {
            console.log("Error signing in:", error);
            Toast.error("Failed to sign in. Please check your credentials.");
            setLoading(false);
          },
        },
      );

      if (error) {
        throw error;
      }
    } catch (error) {
      setLoading(false);
      console.log("Error signing in:", error);
      Toast.error("Failed to sign in. Please check your credentials.");
      return;
    }
  }

  return (
    <>
      <SafeAreaView className="gap-4 w-full">
        <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
          <CardHeader>
            <CardTitle className="text-center text-3xl sm:text-left font-bold tracking-wider">
              GridLock
            </CardTitle>
            <CardDescription className="text-center sm:text-left">
              Welcome back, Master.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              <View className="gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  onSubmitEditing={onEmailSubmitEditing}
                  returnKeyType="next"
                  submitBehavior="submit"
                />
              </View>
              <View className="gap-1.5">
                <View className="flex-row items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    variant="link"
                    size="sm"
                    className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                    onPress={() => {
                      // TODO: Navigate to forgot password screen
                    }}
                  >
                    <Text className="font-normal leading-4">
                      Forgot your password?
                    </Text>
                  </Button>
                </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  onChangeText={setPassword}
                />
              </View>
              <Button className="w-full" onPress={onSubmit} disabled={loading}>
                <Text>Continue</Text>
              </Button>
            </View>
            <Text className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Pressable
                onPress={() => {
                  router.push("/(auth)/sign-up");
                }}
              >
                <Text className="text-sm underline underline-offset-4">
                  Sign up
                </Text>
              </Pressable>
            </Text>
            {/* <View className="flex-row items-center">
              <Separator className="flex-1" />
              <Text className="text-muted-foreground px-4 text-sm">or</Text>
              <Separator className="flex-1" />
            </View>
            <SocialConnections /> */}
          </CardContent>
        </Card>
      </SafeAreaView>
    </>
  );
}
