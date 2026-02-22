import {
  BankHolidayEvent,
  BankHolidaysResponse,
} from "@/services/bank-holidays";

const mockEvent = (title: string, date: string): BankHolidayEvent => ({
  title,
  date,
  notes: "",
  bunting: true,
});

const mockResponse = (
  englandEvents: BankHolidayEvent[] = [],
  scotlandEvents: BankHolidayEvent[] = [],
  northernIrelandEvents: BankHolidayEvent[] = [],
): BankHolidaysResponse => ({
  "england-and-wales": { division: "england-and-wales", events: englandEvents },
  scotland: { division: "scotland", events: scotlandEvents },
  "northern-ireland": {
    division: "northern-ireland",
    events: northernIrelandEvents,
  },
});

describe("filterAndDeduplicateHolidays", () => {
  it("should remove past events", () => {});

  it("should deduplicate events with same date and title across divisions", () => {});

  it("should remove events after 6 months", () => {});

  it("should return max 5 results", () => {});

  it("should should sort results chronologically", () => {});

  it("should exclude events falling on today", () => {});

  it("should keep events with same date but different titles", () => {});

  it("should include events exactly on the 6-month boundary", () => {});
});
