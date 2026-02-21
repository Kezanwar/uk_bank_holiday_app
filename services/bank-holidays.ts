import axios from "@/lib/axios";

export interface BankHolidayEvent {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
}

export interface BankHolidayDivision {
  division: DivisionKey;
  events: BankHolidayEvent[];
}

export interface BankHolidaysResponse {
  "england-and-wales": BankHolidayDivision;
  scotland: BankHolidayDivision;
  "northern-ireland": BankHolidayDivision;
}

export type DivisionKey = "england-and-wales" | "scotland" | "northern-ireland";

export const getNextSixMonthsBankHolidays = async (): Promise<
  BankHolidayEvent[]
> => {
  //no try/catch here, expecting call-site so try/catch and handle error
  const { data } = await axios.get<BankHolidaysResponse>(
    "https://www.gov.uk/bank-holidays.json",
  );
  return filterAndDeduplicateHolidays(data);
};

export const filterAndDeduplicateHolidays = (
  data: BankHolidaysResponse,
): BankHolidayEvent[] => {
  const unique_pot = new Map<string, BankHolidayEvent>();

  const today = new Date();
  const sixMonths = new Date(today);
  sixMonths.setMonth(sixMonths.getMonth() + 6);

  for (let division in data) {
    for (let event of data[division as DivisionKey].events) {
      if (isWithinNextSixMonths(today, sixMonths, event.date)) {
        unique_pot.set(`${event.date}:${event.title}`, event);
      }
    }
  }

  return [...unique_pot.values()].sort(sortByDateChronologically).slice(0, 5);
};

const isWithinNextSixMonths = (
  today: Date,
  sixMonths: Date,
  date: string,
): boolean => {
  const target = new Date(date);
  return target > today && target <= sixMonths;
};

const sortByDateChronologically = (a: BankHolidayEvent, b: BankHolidayEvent) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();
