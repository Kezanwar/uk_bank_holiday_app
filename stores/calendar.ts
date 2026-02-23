import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CalendarState {
  calendar: string[];
  setCalendar: (c: string[]) => void;
  someTextValue: string;
  setSomeTextValue: (s: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      calendar: [],
      setCalendar: (calendar) =>
        set({
          calendar,
        }),
      //value/method to confirm persisted store is working
      someTextValue: "test",
      setSomeTextValue: (text) =>
        set({
          someTextValue: text,
        }),
    }),
    {
      name: "calendar-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
