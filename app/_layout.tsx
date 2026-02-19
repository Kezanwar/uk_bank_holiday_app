import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { useLoadFonts } from "@/hooks/use-load-fonts";
import { ColorSchemeProvider, useColorScheme } from "@/lib/color-scheme";
import { NAV_THEME } from "@/lib/theme";

function RootLayoutNav() {
  const { colorScheme, isDark } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View className={`flex-1 ${isDark ? "dark" : ""}`}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ColorSchemeProvider>
      <RootLayoutNav />
    </ColorSchemeProvider>
  );
}
