import ProblemDetail from "@/lib/problem-detail";
import {
  BankHolidayEvent,
  getNextSixMonthsBankHolidays,
} from "@/services/bank-holidays";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Holiday extends BankHolidayEvent {
  uuid: string;
  edited: boolean;
}

interface HolidaysStore {
  holidays: Holiday[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastFetched:
    | string
    | null; /*using an ISO string for Async Storage serialization */
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  updateHoliday: (
    uuid: string,
    updates: Partial<Pick<Holiday, "title" | "date">>,
  ) => void;
  removeHoliday: (uuid: string) => void;
}

const toHoliday = (event: BankHolidayEvent): Holiday => ({
  ...event,
  uuid: Crypto.randomUUID(),
  edited: false,
});

export const useHolidaysStore = create<HolidaysStore>()(
  persist(
    (set, get) => ({
      holidays: [],
      isLoading: false,
      isRefreshing: false,
      error: null,
      lastFetched: null,

      fetch: async () => {
        set({ isLoading: true, error: null });
        try {
          const events = await getNextSixMonthsBankHolidays();
          set({
            holidays: events.map(toHoliday),
            isLoading: false,
            lastFetched: new Date().toISOString(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof ProblemDetail
                ? error.detail
                : "Failed to fetch holidays",
          });
        }
      },

      refresh: async () => {},

      updateHoliday: (uuid, updates) => {},

      removeHoliday: (uuid) => {
        set({
          holidays: get().holidays.filter((h) => h.uuid !== uuid),
        });
      },
    }),
    {
      name: "holidays-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
