import ScreenTitle from "@/components/screen-title";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useAppForeground } from "@/hooks/use-app-foreground";
import * as Calendar from "expo-calendar";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [calendarEnabled, setCalendarEnabled] = useState(false);

  const checkPermission = useCallback(async () => {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    setCalendarEnabled(status === "granted");
  }, []);

  useFocusEffect(() => {
    checkPermission();
  });

  useAppForeground(checkPermission);

  const handleToggle = async () => {
    if (calendarEnabled) {
      Alert.alert(
        "Calendar Access",
        "To revoke access, go to Settings → UK_BANK_HOLIDAY_APP → Calendars.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
    } else {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        setCalendarEnabled(true);
      } else {
        Alert.alert(
          "Calendar Access Required",
          "Please enable calendar access in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenTitle
        title="Settings"
        subtitle="Manage your settings and permissions"
      />
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center justify-between py-4">
          <View>
            <Text variant={"h4"}>Calendar Access</Text>
            <Text className="text-muted-foreground mt-0">
              {calendarEnabled ? "Enabled" : "Disabled"}
            </Text>
          </View>
          <Switch checked={calendarEnabled} onCheckedChange={handleToggle} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
