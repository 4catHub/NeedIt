import type { components } from "@/types/tax-preview.generated";

// Generated from the explicitly provisional UI fixture, not backend DTOs.
export type TaxInput = components["schemas"]["TaxInput"];
export type Eligibility = components["schemas"]["Eligibility"];
export type Estimate = components["schemas"]["Estimate"];
export type Guide = components["schemas"]["Guide"];
export interface TaxAdapter {
  eligibility(input: TaxInput, signal?: AbortSignal): Promise<Eligibility>;
  estimate(input: TaxInput, signal?: AbortSignal): Promise<Estimate>;
  guide(signal?: AbortSignal): Promise<Guide>;
}
export interface TaxResult {
  eligibility: Eligibility;
  estimate: Estimate | null;
  guide: Guide | null;
  warnings: string[];
  mode: "mock" | "live";
}
