import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "@/providers/color-scheme";
import { addSixMonths, isWithinRange } from "@/services/bank-holidays";
import { useHolidaysStore } from "@/stores/holidays";
import * as Calendar from "expo-calendar";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CalendarPlus, Delete } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Keyboard, Linking, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const addEventToCalendar = async (title: string, date: Date) => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const defaultCalendar = calendars.find((c) => c.allowsModifications);

  if (!defaultCalendar) {
    Alert.alert("Error", "No calendar found");
    return;
  }

  const startDate = date;
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59); /* should we make it all day? */

  const newEventID = await Calendar.createEventAsync(defaultCalendar.id, {
    title,
    startDate,
    endDate,
    allDay: true,
  });

  await Calendar.openEventInCalendarAsync({ id: newEventID });

  /* we can check if they choose to delete the event here, if we wanna handle it somehow?*/
};

export default function EventScreen() {
  const { colorScheme } = useColorScheme();

  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const { updateHoliday, holidays, removeHoliday } = useHolidaysStore();

  const holiday = useMemo(() => {
    return holidays.find((h) => h.uuid === uuid);
  }, [holidays, uuid]);

  const [title, setTitle] = useState(holiday?.title ?? "");
  const [date, setDate] = useState(new Date(holiday?.date ?? new Date()));

  const dateConstraints = useMemo(() => {
    const min = new Date();
    const max = addSixMonths(min);
    return { min, max };
  }, []);

  if (!holiday) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Holiday not found</Text>
        <Button className="mt-4" onPress={() => router.back()}>
          <Text>Go back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const validate = (): string | null => {
    if (title.trim().length === 0) return "Title cannot be empty";

    const today = new Date();
    const sixMonths = new Date(today);
    sixMonths.setUTCMonth(sixMonths.getUTCMonth() + 6);

    if (date <= today) return "Date must be in the future";

    if (!isWithinRange(today, sixMonths, date))
      return "Date must be within 6 months";

    return null;
  };

  const handleSave = () => {
    const errorMessage = validate();
    if (errorMessage) {
      Alert.alert(errorMessage);
      return;
    }

    updateHoliday(uuid, {
      title: title.trim(),
      date: date.toISOString().split("T")[0],
    });
    router.back();
  };

  const handleRemove = () => {
    Alert.alert(
      "Delete Holiday",
      `Are you sure you want to delete "${holiday.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeHoliday(holiday.uuid);
            router.back();
          },
        },
      ],
    );
  };

  const handleUploadToCalendar = async () => {
    const errorMessage = validate();
    if (errorMessage) {
      Alert.alert(errorMessage);
      return;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      await addEventToCalendar(title, date);
      handleSave();
    } else {
      Alert.alert(
        "Calendar Access Required",
        "Please enable calendar access in Settings to add holidays.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  return (
    <Pressable className="flex-1" onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Button
            variant="link"
            className="pl-0 w-20 flex-row justify-start active:opacity-70"
            onPress={router.back}
          >
            <ArrowLeft size={20} color={THEME[colorScheme].primary} />
          </Button>
          <Text className="text-lg font-bold">Edit Holiday</Text>
          <Button
            variant="link"
            className="w-20 flex-row justify-end pr-0"
            onPress={handleSave}
          >
            <Text>Save</Text>
          </Button>
        </View>

        <View className="px-6 pt-4 gap-4">
          <View className="">
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Holiday title"
              className="text-center"
            />
          </View>

          <View className="mb-4 flex-row justify-center">
            <DatePicker
              mode="date"
              display="inline"
              value={date}
              minimumDate={dateConstraints.min}
              maximumDate={dateConstraints.max}
              onChange={(_, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
            />
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Button
                size={"lg"}
                variant="outline"
                onPress={handleUploadToCalendar}
              >
                <CalendarPlus size={18} color={THEME[colorScheme].systemBlue} />
              </Button>
            </View>
            <View className="flex-1">
              <Button size={"lg"} variant="outline" onPress={handleRemove}>
                <Delete size={18} color={THEME[colorScheme].destructive} />
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
