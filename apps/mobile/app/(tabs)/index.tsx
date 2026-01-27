import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabOneScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black justify-center items-center w-full p-4">
      <Card className="p-6 rounded-xl border ">
        <CardContent>
          <Text className="text-2xl text-center font-bold  mb-2">
            GridLock Mobile
          </Text>
          <Text className="text-muted-foreground text-center">
            NativeWind is active. Backend Status: Pending connection...
          </Text>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
