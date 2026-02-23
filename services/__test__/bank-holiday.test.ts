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

  it("should deduplicate events with same date and title across divisions", () => {
    const data = mockResponse({
      england: [mockEvent("Some Bank Holiday", "2026-05-07")],
      scotland: [mockEvent("Some Bank Holiday", "2026-05-07")],
      northernIreland: [mockEvent("Some Bank Holiday", "2026-05-07")],
    });

    const result = filterAndDeduplicateHolidays(data, today);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Some Bank Holiday");
  });

  it("should keep events with same date but different titles", () => {
    const data = mockResponse({
      england: [mockEvent("Some Bank Holiday", "2026-05-07")],
      scotland: [mockEvent("Some Other Bank Holiday", "2026-05-07")],
      northernIreland: [mockEvent("Some Bank Holiday", "2026-05-07")],
    });

    const result = filterAndDeduplicateHolidays(data, today);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Some Bank Holiday");
    expect(result[1].title).toBe("Some Other Bank Holiday");
  });

  it("should remove events after 6 months", () => {
    const data = mockResponse({
      england: [mockEvent("Some Bank Holiday", "2026-05-07")],
      scotland: [mockEvent("Some Other Bank Holiday", "2026-05-07")],
      northernIreland: [mockEvent("Some Bank Holiday", "2026-10-02")],
    });

    const result = filterAndDeduplicateHolidays(data, today);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Some Bank Holiday");
    expect(result[1].title).toBe("Some Other Bank Holiday");
  });

  it("should return max 5 results", () => {
    const data = mockResponse({
      england: [
        mockEvent("Some Bank Holiday", "2026-05-07"),
        mockEvent("May 2nd Bank Holiday", "2026-05-01"),
        mockEvent("May 3rd Bank Holiday", "2026-05-02"),
      ],
      scotland: [mockEvent("Feb 7th Bank Holiday", "2026-02-07")],
      northernIreland: [
        mockEvent("March 7th Bank Holiday", "2026-03-07"),
        mockEvent("Aprils Fool Bank Holiday", "2026-04-01"),
      ],
    });

    const result = filterAndDeduplicateHolidays(data, today);

    expect(result).toHaveLength(5);
  });

  // it("should should sort results chronologically", () => {});

  // it("should exclude events falling on today", () => {});

  // it("should include events exactly on the 6-month boundary", () => {});
});
