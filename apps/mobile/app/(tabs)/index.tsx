import { Text } from "@/components/Themed";
import "@/global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  return (
    <SafeAreaView className="container">
      <Text className="text-center font-semibold text-2xl">Tab One</Text>
    </SafeAreaView>
  );
}
