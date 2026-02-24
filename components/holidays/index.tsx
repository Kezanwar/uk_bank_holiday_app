import { Holiday, useHolidaysStore } from "@/stores/holidays";
import { useFocusEffect } from "expo-router";
import React, { useMemo } from "react";
import { SectionList } from "react-native";
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

const Holidays = () => {
  const { holidays, lastFetched, fetch } = useHolidaysStore();

  useFocusEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastFetchedDate = lastFetched?.split("T")[0];

    if (lastFetchedDate !== today) {
      fetch();
    }
  });

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

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.uuid}
      className="px-6"
      renderSectionHeader={({ section: { title } }) => (
        <Text className="text-sm font-semibold py-3 text-muted-foreground">
          {title}
        </Text>
      )}
      renderItem={({ item }) => <HolidayItem holiday={item} />}
    />
  );
};

export default Holidays;
