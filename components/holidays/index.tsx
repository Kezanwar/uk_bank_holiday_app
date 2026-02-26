import { useAppForeground } from "@/hooks/use-app-foreground";
import { Holiday, useHolidaysStore } from "@/stores/holidays";
import { useFocusEffect } from "expo-router";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { SectionList, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOutLeft,
  LinearTransition,
} from "react-native-reanimated";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import HolidayItem from "./item";

interface MonthSection {
  title: string;
  data: Holiday[];
}

const formatMonthHeader = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "long" });
};

const AnimatedWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Animated.View
      exiting={FadeOutLeft.duration(200)}
      entering={FadeIn.duration(200)}
      layout={LinearTransition.duration(300)}
    >
      {children}
    </Animated.View>
  );
};

const Holidays = () => {
  const {
    holidays,
    lastFetched,
    fetch,
    isLoading,
    refresh,
    isRefreshing,
    error,
  } = useHolidaysStore();

  const fetchHolidays = useCallback(() => {
    if (lastFetched) {
      const today = new Date().toISOString().split("T")[0];
      const lastFetchedDate = lastFetched.split("T")[0];
      if (lastFetchedDate !== today) {
        refresh();
      }
    } else {
      fetch();
    }
  }, [fetch, lastFetched, refresh]);

  useFocusEffect(fetchHolidays);

  useAppForeground(fetchHolidays);

  const sections = useMemo<MonthSection[]>(() => {
    const grouped = new Map<string, Holiday[]>();

    for (const holiday of holidays) {
      const key = formatMonthHeader(holiday.date);
      const existing = grouped.get(key) ?? [];
      existing.push(holiday);
      grouped.set(key, existing);
    }

    return Array.from(grouped, ([title, data]) => ({ title, data }));
  }, [holidays]);

  if (!isLoading && error) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text variant={"h4"} className="text-destructive mb-4">
          {error}
        </Text>
        <Button onPress={fetch}>
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  if (!isLoading && holidays.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-muted-foreground mb-4">No holidays found</Text>
        <Button onPress={fetch}>
          <Text>Refresh</Text>
        </Button>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      onRefresh={refresh}
      refreshing={isRefreshing}
      keyExtractor={(item) => item.uuid}
      renderSectionHeader={({ section: { title } }) => (
        <AnimatedWrapper>
          <Text className="text-sm font-semibold py-3 px-6 text-muted-foreground">
            {title}
          </Text>
        </AnimatedWrapper>
      )}
      renderItem={({ item }) => (
        <AnimatedWrapper>
          <HolidayItem holiday={item} />
        </AnimatedWrapper>
      )}
    />
  );
};

export default Holidays;
