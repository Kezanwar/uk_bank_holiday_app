import ProblemDetail from "@/lib/problem-detail";
import {
  BankHolidayEvent,
  eventKey,
  getNextSixMonthsBankHolidays,
  sortByDateChronologically,
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
          console.error(error);
          set({
            isLoading: false,
            error:
              error instanceof ProblemDetail
                ? error.detail
                : "Failed to fetch holidays",
          });
        }
      },

      refresh: async () => {
        set({ isRefreshing: true, error: null });
        try {
          const events = await getNextSixMonthsBankHolidays();
          const existing = get().holidays;

          const editedByUuid = new Map<string, Holiday>();
          const existingByKey = new Map<string, Holiday>();

          for (const holiday of existing) {
            if (holiday.edited) {
              /*user has edited*/
              editedByUuid.set(holiday.uuid, holiday);
            } else {
              existingByKey.set(eventKey(holiday), holiday);
            }
          }

          /*merge new with existing unedited if they are the same*/
          const merged = events.map((event) => {
            const key = eventKey(event);
            const existingHoliday = existingByKey.get(key);

            if (existingHoliday) {
              /*keep the existing with its uuid but update with fresh API data*/
              return { ...existingHoliday, ...event };
            }

            return toHoliday(event);
          });

          /*keep users edited holidays, merge them back in*/
          for (const edited of editedByUuid.values()) {
            merged.push(edited);
          }

          merged.sort(sortByDateChronologically); /*resort again*/

          set({
            holidays: merged,
            isRefreshing: false,
            lastFetched: new Date().toISOString(),
          });
        } catch (error) {
          console.error(error);
          set({
            isRefreshing: false,
            error:
              error instanceof ProblemDetail
                ? error.detail
                : "Failed to refresh holidays",
          });
        }
      },

      updateHoliday: (uuid, updates) => {
        set({
          holidays: get().holidays.map((h) =>
            h.uuid === uuid
              ? { ...h, ...updates, edited: true /*mark as edited*/ }
              : h,
          ),
        });
      },

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
