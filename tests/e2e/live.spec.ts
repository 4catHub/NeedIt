import { test, expect } from "@playwright/test";
import { fillTax } from "./helpers";
import { staticGuide } from "../../src/features/tax/api/mock";

// Real HTTP adapter exercised against intercepted preview-contract fixtures.
// This is not a claim of backend compatibility.
test("available amount, official API guide, request contract and loading", async ({ page }) => {
  let release!: () => void;
  const wait = new Promise<void>((resolve) => {
    release = resolve;
  });
  const posts: unknown[] = [];
  await page.route("http://127.0.0.1:4400/api/needit/v1/tax/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (!path.endsWith("/guide")) posts.push(route.request().postDataJSON());
    if (path.endsWith("/eligibility")) {
      await wait;
      await route.fulfill({
        json: {
          status: "REVIEW_REQUIRED",
          message: "신고 안내를 확인하세요.",
          items: ["지급명세서 확인"],
        },
      });
    } else if (path.endsWith("/estimate"))
      await route.fulfill({
        json: { status: "AVAILABLE", refundAmount: 25000, message: "검증용 API 응답입니다." },
      });
    else await route.fulfill({ json: staticGuide });
  });
  await fillTax(page);
  await page.getByRole("button", { name: "진단 결과 보기" }).click();
  await expect(page.getByRole("button", { name: "확인 중…" })).toBeDisabled();
  release();
  await expect(page).toHaveURL(/\/tax\/result$/);
  await expect(page.getByText("25,000원", { exact: true })).toBeVisible();
  await expect(
    page.getByText("공식 출처를 바탕으로 제공된 안내입니다.", { exact: false }),
  ).toBeVisible();
  expect(posts).toEqual(
    Array(2).fill({
      taxYear: 2025,
      incomeType: "BUSINESS",
      grossIncome: 10000000,
      withholdingTax: 330000,
    }),
  );
  await expect(page.getByText("체험 결과", { exact: true })).toHaveCount(0);
});

for (const status of ["UNAVAILABLE", "MORE_INFO"] as const) {
  test(`estimate ${status}: no invented amount`, async ({ page }) => {
    await page.route("**/api/needit/v1/tax/**", (route) => {
      const path = route.request().url();
      return route.fulfill({
        json: path.endsWith("/eligibility")
          ? { status: "MORE_INFO", message: "추가 자료 확인 필요", items: ["원본 확인"] }
          : path.endsWith("/estimate")
            ? { status, refundAmount: null, message: "계산할 수 없습니다." }
            : staticGuide,
      });
    });
    await fillTax(page, true);
    await page.getByRole("button", { name: "진단 결과 보기" }).click();
    await expect(page).toHaveURL(/\/tax\/result$/);
    await expect(
      page.getByText(
        status === "MORE_INFO"
          ? "추가 정보가 필요합니다."
          : "현재 입력값만으로는 계산할 수 없습니다.",
        { exact: true },
      ),
    ).toBeVisible();
    await expect(page.locator(".result-amount")).toHaveCount(0);
  });
}

test("unsupported income skips estimate; unsafe guide links are not rendered", async ({ page }) => {
  let estimateCalled = false;
  await page.route("**/api/needit/v1/tax/**", (route) => {
    const url = route.request().url();
    if (url.endsWith("/estimate")) estimateCalled = true;
    return route.fulfill({
      json: url.endsWith("/eligibility")
        ? { status: "UNSUPPORTED", message: "지원하지 않는 유형", items: [] }
        : {
            ...staticGuide,
            officialUrl: "https://evil.test/",
            sourceUrl: "https://nts.go.kr.evil.test/",
          },
    });
  });
  await fillTax(page);
  await page.getByRole("button", { name: "진단 결과 보기" }).click();
  await expect(
    page.getByRole("heading", { name: "이 소득 유형은 현재 진단을 지원하지 않아요." }),
  ).toBeVisible();
  expect(estimateCalled).toBe(false);
  await expect(page.locator('a[href*="evil.test"]')).toHaveCount(0);
});

for (const failure of ["validation", "server", "network"] as const) {
  test(`${failure} failure: friendly message and retry preserve inputs`, async ({ page }) => {
    let fail = true;
    await page.route("**/api/needit/v1/tax/**", (route) => {
      if (route.request().url().endsWith("/eligibility") && fail) {
        if (failure === "network") return route.abort("failed");
        return route.fulfill({
          status: failure === "validation" ? 422 : 500,
          json: { message: "PRIVATE 10000000" },
        });
      }
      return route.fulfill({
        json: route.request().url().endsWith("/eligibility")
          ? { status: "MORE_INFO", message: "재시도 완료", items: [] }
          : route.request().url().endsWith("/estimate")
            ? { status: "UNAVAILABLE", refundAmount: null, message: "자료 확인 필요" }
            : staticGuide,
      });
    });
    await fillTax(page);
    await page.getByRole("button", { name: "진단 결과 보기" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      {
        validation: "입력 내용을 처리할 수 없습니다.",
        server: "서버가 요청을 처리하지 못했습니다.",
        network: "서버에 연결할 수 없습니다.",
      }[failure],
    );
    await expect(page.getByText("PRIVATE 10000000")).toHaveCount(0);
    await expect(page).toHaveURL(/\/tax\/check$/);
    fail = false;
    await page.getByRole("button", { name: "진단 결과 보기" }).click();
    await expect(page).toHaveURL(/\/tax\/result$/);
  });
}

test("partial API outage keeps result and provides sourced static guide", async ({ page }) => {
  await page.route("**/api/needit/v1/tax/**", (route) =>
    route.request().url().endsWith("/eligibility")
      ? route.fulfill({ json: { status: "REVIEW_REQUIRED", message: "자료 확인 필요", items: [] } })
      : route.fulfill({ status: 500, json: {} }),
  );
  await fillTax(page);
  await page.getByRole("button", { name: "진단 결과 보기" }).click();
  await expect(page).toHaveURL(/\/tax\/result$/);
  await expect(
    page.getByText("최신 가이드를 불러오지 못했습니다. 아래 공식 출처 안내를 참고하세요."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "국세청 공식 출처" })).toHaveAttribute(
    "href",
    staticGuide.sourceUrl,
  );
});
