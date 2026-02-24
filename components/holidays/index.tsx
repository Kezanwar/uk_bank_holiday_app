import { useHolidaysStore } from "@/stores/holidays";
import { useFocusEffect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";

type Props = {};

const Holidays = (props: Props) => {
  const { holidays, isLoading, lastFetched, fetch } = useHolidaysStore();

  useFocusEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastFetchedDate = lastFetched?.split("T")[0];

    if (lastFetchedDate !== today) {
      fetch();
    }
  });

  return (
    <View className="px-6">
      <Text>{isLoading ? "loading..." : JSON.stringify(holidays)}</Text>
    </View>
  );
};

export default Holidays;
