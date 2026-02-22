import {
  BankHolidayEvent,
  BankHolidaysResponse,
  filterAndDeduplicateHolidays,
} from "@/services/bank-holidays";

const mockEvent = (title: string, date: string): BankHolidayEvent => ({
  title,
  date,
  notes: "",
  bunting: true,
});

const mockResponse = ({
  england = [],
  scotland = [],
  northernIreland = [],
}: {
  england?: BankHolidayEvent[];
  scotland?: BankHolidayEvent[];
  northernIreland?: BankHolidayEvent[];
} = {}): BankHolidaysResponse => ({
  "england-and-wales": { division: "england-and-wales", events: england },
  scotland: { division: "scotland", events: scotland },
  "northern-ireland": { division: "northern-ireland", events: northernIreland },
});

const today = new Date("2026-02-22");

describe("filterAndDeduplicateHolidays", () => {
  it("should remove past events", () => {
    const data = mockResponse({
      england: [
        mockEvent("New Year's Day", "2026-01-01"),
        mockEvent("Good Friday", "2026-04-03"),
      ],
    });

    const result = filterAndDeduplicateHolidays(data, today);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Good Friday");
  });

  // it("should deduplicate events with same date and title across divisions", () => {});

  // it("should remove events after 6 months", () => {});

  // it("should return max 5 results", () => {});

  // it("should should sort results chronologically", () => {});

  // it("should exclude events falling on today", () => {});

  // it("should keep events with same date but different titles", () => {});

  // it("should include events exactly on the 6-month boundary", () => {});
});
