import { create } from "zustand";

interface CalendarState {
  calendar: string[];
  setCalendar: (c: string[]) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  //initial state
  calendar: [],
  //actions
  setCalendar: (calendar) =>
    set({
      calendar,
    }),
}));
