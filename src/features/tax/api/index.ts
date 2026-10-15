import { mockAdapter } from "./mock";
import { createLiveAdapter } from "./live";
import type { TaxAdapter, TaxInput, TaxResult } from "./types";
import { ApiError } from "@/lib/api/client";

export const apiMode = process.env.NEXT_PUBLIC_NEEDIT_API_MODE === "live" ? "live" : "mock";
export function getAdapter(): TaxAdapter {
  if (apiMode === "mock") return mockAdapter;
  return createLiveAdapter(
    process.env.NEXT_PUBLIC_NEEDIT_API_BASE_URL ?? "",
    process.env.NEXT_PUBLIC_NEEDIT_CONTRACT_VERIFIED === "true",
  );
}
export async function diagnose(
  input: TaxInput,
  adapter = getAdapter(),
  signal?: AbortSignal,
): Promise<TaxResult> {
  const eligibility = await adapter.eligibility(input, signal);
  const warnings: string[] = [];
  let estimate = null;
  if (eligibility.status !== "UNSUPPORTED") {
    try {
      estimate = await adapter.estimate(input, signal);
    } catch (error) {
      if (signal?.aborted) throw error;
      warnings.push(
        error instanceof ApiError ? error.message : "예상 환급액을 불러오지 못했습니다.",
      );
    }
  }
  let guide = null;
  try {
    guide = await adapter.guide(signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    warnings.push("최신 가이드를 불러오지 못했습니다. 아래 공식 출처 안내를 참고하세요.");
  }
  return { eligibility, estimate, guide, warnings, mode: apiMode };
}
