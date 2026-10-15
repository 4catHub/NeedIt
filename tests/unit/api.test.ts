import { afterEach, describe, expect, it, vi } from "vitest";
import { request, ApiError } from "@/lib/api/client";
import { createLiveAdapter } from "@/features/tax/api/live";
import { estimateSchema } from "@/features/tax/api/validation";
import { mockAdapter } from "@/features/tax/api/mock";
import { diagnose } from "@/features/tax/api";
import type { TaxAdapter } from "@/features/tax/api/types";
import { isOfficialUrl } from "@/config/official";
const input = {
  taxYear: 2025,
  incomeType: "BUSINESS" as const,
  grossIncome: 10000000,
  withholdingTax: null,
};
const available = { status: "AVAILABLE", refundAmount: 15000, message: "test fixture" };
afterEach(() => vi.unstubAllGlobals());
describe("HTTP adapter", () => {
  it("sends typed JSON to the endpoint without credentials or caching", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(available));
    vi.stubGlobal("fetch", fetcher);
    await expect(createLiveAdapter("https://example.com/", true).estimate(input)).resolves.toEqual(
      available,
    );
    expect(fetcher).toHaveBeenCalledWith(
      "https://example.com/api/needit/v1/tax/estimate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(input),
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
      }),
    );
  });
  it.each([400, 422, 500, 503])(
    "maps status %s without leaking the server body",
    async (status) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("private income 10000000", { status })),
      );
      try {
        await request("https://example.com", "/estimate", estimateSchema, input);
        expect.unreachable();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).kind).toBe(status < 500 ? "validation" : "server");
        expect(String(error)).not.toContain("10000000");
      }
    },
  );
  it("maps network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("secret")));
    await expect(request("https://example.com", "/", estimateSchema)).rejects.toMatchObject({
      kind: "network",
    });
  });
  it("maps timeout separately", async () => {
    vi.useFakeTimers();
    vi.spyOn(AbortSignal, "timeout").mockImplementation(() =>
      AbortSignal.abort(new DOMException("Timeout", "TimeoutError")),
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Timeout", "TimeoutError")));
    await expect(request("https://example.com", "/", estimateSchema)).rejects.toMatchObject({
      kind: "timeout",
    });
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  it("propagates caller cancellation", async () => {
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")));
    await expect(
      request("https://example.com", "/", estimateSchema, input, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });
  it.each([
    { ...available, refundAmount: null },
    { ...available, refundAmount: -1 },
    { ...available, refundAmount: 1.5 },
    { status: "UNAVAILABLE", refundAmount: 5, message: "bad" },
    { foo: "bar" },
  ])("rejects malformed or inconsistent responses", async (response) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(response)));
    await expect(request("https://example.com", "/", estimateSchema)).rejects.toMatchObject({
      kind: "contract",
    });
  });
  it("rejects non-JSON success responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>error</html>")));
    await expect(request("https://example.com", "/", estimateSchema)).rejects.toMatchObject({
      kind: "contract",
    });
  });
  it("requires a verified contract and a valid API origin", () => {
    expect(() => createLiveAdapter("https://example.com", false)).toThrow(ApiError);
    expect(() => createLiveAdapter("javascript:alert(1)", true)).toThrow(ApiError);
  });
});
describe("diagnostic orchestration", () => {
  it("never fabricates refund amounts in mock mode", async () => {
    const result = await diagnose(input, mockAdapter);
    expect(result.estimate?.refundAmount).toBeNull();
    expect(result.eligibility.status).toBe("MORE_INFO");
  });
  it("skips estimate for unsupported income while retaining the guide", async () => {
    const adapter: TaxAdapter = {
      ...mockAdapter,
      eligibility: async () => ({ status: "UNSUPPORTED", message: "지원하지 않음", items: [] }),
      estimate: vi.fn(),
    };
    const result = await diagnose(input, adapter);
    expect(adapter.estimate).not.toHaveBeenCalled();
    expect(result.estimate).toBeNull();
    expect(result.guide).not.toBeNull();
  });
  it("preserves eligibility when estimate and guide requests fail", async () => {
    const adapter = {
      ...mockAdapter,
      estimate: async () => {
        throw new ApiError("server");
      },
      guide: async () => {
        throw new ApiError("network");
      },
    };
    const result = await diagnose(input, adapter);
    expect(result.eligibility).toBeDefined();
    expect(result.warnings).toHaveLength(2);
    expect(result.estimate).toBeNull();
    expect(result.guide).toBeNull();
  });
  it("requires eligibility success", async () => {
    await expect(
      diagnose(input, {
        ...mockAdapter,
        eligibility: async () => {
          throw new ApiError("validation");
        },
      }),
    ).rejects.toMatchObject({ kind: "validation" });
  });
});
describe("official links", () => {
  it.each(["https://www.hometax.go.kr/", "https://b.nts.go.kr/a", "https://nts.go.kr/"])(
    "accepts %s",
    (url) => expect(isOfficialUrl(url)).toBe(true),
  );
  it.each([
    "https://nts.go.kr.evil.test",
    "javascript:alert(1)",
    "http://nts.go.kr",
    "https://evilnts.go.kr",
    "https://user:pass@nts.go.kr/",
  ])("rejects %s", (url) => expect(isOfficialUrl(url)).toBe(false));
});
