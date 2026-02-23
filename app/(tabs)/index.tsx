import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { getNextSixMonthsBankHolidays } from "@/services/bank-holidays";
import { useCalendarStore } from "@/stores/calendar";
import { Href, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function DatePickerExample() {
  //testing out ported date picker
  const [date, setDate] = useState(new Date());
  return (
    <View className="items-center">
      <DatePicker
        value={date}
        mode="datetime"
        onChange={(ev) => {
          setDate(new Date(ev.nativeEvent.timestamp));
        }}
      />
    </View>
  );
}

function PersistedStoreExample() {
  //testing out persisted zustand store
  const someTextValue = useCalendarStore((state) => state.someTextValue);
  const setSomeTextValue = useCalendarStore((state) => state.setSomeTextValue);

  const generateRandom = () => {
    setSomeTextValue(String(Math.floor(Math.random() * 10000)));
  };

  return (
    <>
      <Text>{someTextValue}</Text>
      <Button variant={"ghost"} onPress={generateRandom}>
        <Text variant={"h3"}>Generate</Text>
      </Button>
    </>
  );
}

function DataFetchExample() {
  //testing out service/bank-holidays
  const [json, setJson] = useState("");
  useEffect(() => {
    getNextSixMonthsBankHolidays()
      .then((res) => setJson(JSON.stringify(res)))
      .catch((err) => console.log(err));
  }, []);

  if (!json) {
    return <Text>Loading...</Text>;
  }

  return <Text>{json}</Text>;
}

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4">
        <Text className="text-3xl font-bold text-foreground">
          Bank Holidays
        </Text>
        <Text className="text-muted-foreground mt-1">By Kez Anwar</Text>
      </View>

      <ScrollView className="flex-1 gap-4 px-6">
        <Pressable
          onPress={() => router.push("/day" as Href)} //router link
          className="bg-card border border-border rounded-lg p-4 mb-3 active:opacity-70"
        >
          <Text className="text-foreground font-semibold text-lg">
            UK Bank Holiday Calendar APp
          </Text>
        </Pressable>
        <DatePickerExample />
        <PersistedStoreExample />
        <DataFetchExample />
      </ScrollView>
    </SafeAreaView>
  );
}
