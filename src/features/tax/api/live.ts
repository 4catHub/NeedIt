import type { TaxAdapter } from "./types";
import { eligibilitySchema, estimateSchema, guideSchema } from "./validation";
import { request, ApiError } from "@/lib/api/client";

export function createLiveAdapter(base: string, verified: boolean): TaxAdapter {
  let valid = false;
  try {
    const url = new URL(base);
    valid =
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash;
  } catch {
    /* Invalid configuration is shown safely to the user. */
  }
  if (!valid || !verified) throw new ApiError("config");
  return {
    eligibility: (input, signal) =>
      request(base, "/api/needit/v1/tax/eligibility", eligibilitySchema, input, signal),
    estimate: (input, signal) =>
      request(base, "/api/needit/v1/tax/estimate", estimateSchema, input, signal),
    guide: (signal) => request(base, "/api/needit/v1/tax/guide", guideSchema, undefined, signal),
  };
}
