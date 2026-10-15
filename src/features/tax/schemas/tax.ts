import { z } from "zod";

export const moneySchema = z.number().int().min(0).max(999_999_999_999);
export const incomeTypes = ["BUSINESS", "EMPLOYMENT", "OTHER", "MULTIPLE", "UNKNOWN"] as const;
export const taxSchema = z.object({
  taxYear: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() - 1),
  incomeType: z.enum(incomeTypes),
  grossIncome: moneySchema,
  withholdingTax: moneySchema.nullable(),
});
export type TaxForm = z.infer<typeof taxSchema>;
export const incomeLabels: Record<TaxForm["incomeType"], string> = {
  BUSINESS: "프리랜서 / 사업소득",
  EMPLOYMENT: "근로소득",
  OTHER: "기타소득",
  MULTIPLE: "여러 소득 유형",
  UNKNOWN: "잘 모르겠어요",
};
export function parseMoney(value: string): number | null {
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) return null;
  const parsed = Number(value.replaceAll(",", ""));
  return moneySchema.safeParse(parsed).success ? parsed : null;
}
export function formatMoney(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
