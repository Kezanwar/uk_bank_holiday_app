import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

import { useLoadFonts } from "@/hooks/use-load-fonts";

import { NAV_THEME } from "@/lib/theme";
import { ColorSchemeProvider, useColorScheme } from "@/providers/color-scheme";
import { enableFreeze } from "react-native-screens";

enableFreeze(true);

function RootLayoutNav() {
  const { colorScheme, isDark } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className={`flex-1 ${isDark ? "dark" : ""}`}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="event" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
    //show a splash here?
  }

  return (
    <ColorSchemeProvider>
      <GestureHandlerRootView className="flex-1">
        <RootLayoutNav />
      </GestureHandlerRootView>
    </ColorSchemeProvider>
  );
}
