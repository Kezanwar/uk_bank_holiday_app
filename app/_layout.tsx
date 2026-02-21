import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { useLoadFonts } from "@/hooks/use-load-fonts";

import { NAV_THEME } from "@/lib/theme";
import { ColorSchemeProvider, useColorScheme } from "@/providers/color-scheme";
import { getNextSixMonthsBankHolidays } from "@/services/bank-holidays";
import { useEffect } from "react";

function RootLayoutNav() {
  const { colorScheme, isDark } = useColorScheme();

  //testing out service/bank-holidays
  useEffect(() => {
    getNextSixMonthsBankHolidays()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

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
