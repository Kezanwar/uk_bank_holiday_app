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
  /*fetch data from gov site 
  (no try/catch here, expecting call-site so try/catch and handle error)
  */
  const { data } = await axios.get<BankHolidaysResponse>(
    "https://www.gov.uk/bank-holidays.json",
  );
  /*our business logic sits here*/
  return filterAndDeduplicateHolidays(data);
};

export const filterAndDeduplicateHolidays = (
  data: BankHolidaysResponse,
  today: Date = new Date(),
): BankHolidayEvent[] => {
  const unique_pot = new Map<string, BankHolidayEvent>();

  const sixMonths = new Date(today);
  sixMonths.setMonth(sixMonths.getMonth() + 6);

  for (let division in data) {
    for (let event of data[division as DivisionKey].events) {
      if (isWithinRange(today, sixMonths, new Date(event.date))) {
        unique_pot.set(`${event.date}:${event.title}`, event);
      }
    }
  }

  return [...unique_pot.values()].sort(sortByDateChronologically).slice(0, 5);
};

const isWithinRange = (start: Date, end: Date, dateToCheck: Date): boolean => {
  return dateToCheck > start && dateToCheck <= end;
};

const sortByDateChronologically = (a: BankHolidayEvent, b: BankHolidayEvent) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();
