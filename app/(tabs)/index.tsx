import { Href, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-foreground">
          Bank Holidays
        </Text>
        <Text className="text-muted-foreground mt-1">By Kez Anwar</Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <Pressable
          onPress={() => router.push("....." as Href)} //router link
          className="bg-card border border-border rounded-lg p-4 mb-3 active:opacity-70"
        >
          <Text className="text-foreground font-semibold text-lg">
            UK Bank Holiday Calendar APp
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
