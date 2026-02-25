import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "@/providers/color-scheme";
import { addSixMonths, isWithinRange } from "@/services/bank-holidays";
import { useHolidaysStore } from "@/stores/holidays";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CalendarPlus, Delete } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Alert, Keyboard, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventScreen() {
  const { colorScheme } = useColorScheme();

  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const { updateHoliday, holidays } = useHolidaysStore();

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
              <Button size={"lg"} variant="outline" onPress={() => {}}>
                <CalendarPlus size={18} color={THEME[colorScheme].systemBlue} />
              </Button>
            </View>
            <View className="flex-1">
              <Button size={"lg"} variant="outline" onPress={() => {}}>
                <Delete size={18} color={THEME[colorScheme].destructive} />
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}
