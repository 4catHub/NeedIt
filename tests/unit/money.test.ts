import { describe, expect, it } from "vitest";
import { parseMoney, formatMoney, taxSchema } from "@/features/tax/schemas/tax";
describe("money input", () => {
  it.each([
    ["0", 0],
    ["1,234,567", 1234567],
    ["999999999999", 999999999999],
  ])("parses %s", (input, expected) => expect(parseMoney(input)).toBe(expected));
  it.each([
    "",
    "-1",
    "1.5",
    "1e6",
    "abc",
    "₩100",
    "1,00",
    "12,,000",
    "1000000000000",
    " ",
    "Infinity",
  ])("rejects invalid input %s", (input) => expect(parseMoney(input)).toBeNull());
  it("formats KRW as an integer", () => expect(formatMoney(1234567)).toBe("1,234,567"));
  it("requires year and income; permits unknown withholding without guessing", () => {
    expect(taxSchema.safeParse({}).success).toBe(false);
    expect(
      taxSchema.safeParse({
        taxYear: new Date().getFullYear(),
        incomeType: "BUSINESS",
        grossIncome: 0,
        withholdingTax: null,
      }).success,
    ).toBe(false);
    expect(
      taxSchema.safeParse({
        taxYear: 2025,
        incomeType: "UNKNOWN",
        grossIncome: 0,
        withholdingTax: null,
      }).success,
    ).toBe(true);
  });
});
