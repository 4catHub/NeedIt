import { z } from "zod";
import { moneySchema } from "../schemas/tax";

export const eligibilitySchema = z.object({
  status: z.enum(["REVIEW_REQUIRED", "MORE_INFO", "UNSUPPORTED"]),
  message: z.string().min(1),
  items: z.array(z.string()),
});
export const estimateSchema = z
  .object({
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "MORE_INFO"]),
    refundAmount: moneySchema.nullable(),
    message: z.string().min(1),
  })
  .refine((v) => (v.status === "AVAILABLE" ? v.refundAmount !== null : v.refundAmount === null));
export const guideSchema = z.object({
  title: z.string().min(1),
  preparation: z.array(z.string()),
  steps: z.array(z.string()),
  officialUrl: z.url(),
  sourceUrl: z.url(),
  checkedAt: z.iso.date(),
});
