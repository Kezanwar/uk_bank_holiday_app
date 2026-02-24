import ScreenTitle from "@/components/screen-title";
import { Text } from "@/components/ui/text";
import { useHolidaysStore } from "@/stores/holidays";
import { useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { holidays, isLoading, lastFetched, fetch } = useHolidaysStore();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastFetchedDate = lastFetched?.split("T")[0];

    if (lastFetchedDate !== today) {
      fetch();
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScreenTitle
        title="Bank Holidays"
        subtitle="England, Wales, Scotland and Northern Ireland"
      />
      <Text>{isLoading ? "loading..." : JSON.stringify(holidays)}</Text>
    </SafeAreaView>
  );
}
