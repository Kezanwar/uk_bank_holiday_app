import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [checked, setChecked] = useState(false);

  function onPress() {
    setChecked((prev) => !prev);
  }

  function onCheckedChange(checked: boolean) {
    setChecked(checked);
  }
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          id="airplane-mode"
          nativeID="airplane-mode"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
