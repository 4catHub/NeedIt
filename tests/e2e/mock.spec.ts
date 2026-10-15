import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fillTax } from "./helpers";

test("home: catalogue, navigation, theme, keyboard and responsive layout", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("굳이 필요할까");
  await expect(page.locator(".service-card")).toHaveCount(7);
  await expect(page.getByText("Coming Soon · 준비 중", { exact: true })).toHaveCount(6);
  await expect(page.getByRole("link", { name: "직접 확인하기" })).toHaveAttribute("href", "/tax");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "본문으로 건너뛰기" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeInViewport();
  await page.getByRole("button", { name: "화면 테마 전환" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "화면 테마 전환" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole("link", { name: "직접 확인하기" }).click();
  await expect(page).toHaveURL(/\/tax$/);
  await expect(page.getByRole("heading", { name: "이미 낸 세금," })).toBeVisible();
  await expect(page.getByRole("link", { name: "홈택스 바로가기" })).toHaveAttribute(
    "href",
    "https://www.hometax.go.kr/",
  );
  await page.getByRole("link", { name: "진단 시작하기" }).click();
  await expect(page).toHaveURL(/\/tax\/check$/);
});

test("form: validation, formatting, preserved steps, mock result and privacy", async ({ page }) => {
  const taxRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/needit/")) taxRequests.push(request.url());
  });
  await page.goto("/tax/check");
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByText("소득 귀속연도를 선택해 주세요.", { exact: true })).toBeVisible();
  await page.getByLabel("소득 귀속연도 (필수)").selectOption("2025");
  await page.getByRole("button", { name: "다음" }).click();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByText("소득 유형을 선택해 주세요.", { exact: true })).toBeVisible();
  await page.getByLabel("프리랜서 / 사업소득").check();
  await page.getByRole("button", { name: "다음" }).click();
  await page.getByLabel("총수입금액 (필수)").fill("-100");
  await page.getByLabel("원천징수세액 (필수)").fill("3.3");
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByText("총수입금액을 올바른 정수 금액으로 입력해 주세요.")).toBeVisible();
  const gross = page.getByLabel("총수입금액 (필수)");
  await gross.fill("");
  await gross.pressSequentially("10000000");
  await expect(gross).toHaveValue("10,000,000");
  await page.getByLabel("원천징수세액을 모르겠어요").check();
  await expect(page.getByLabel("원천징수세액 (필수)")).toBeDisabled();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "이전", exact: true }).click();
  await expect(page.getByLabel("프리랜서 / 사업소득")).toBeChecked();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(gross).toHaveValue("10,000,000");
  await expect(page.getByLabel("원천징수세액을 모르겠어요")).toBeChecked();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByRole("heading", { name: "입력한 내용을 확인해 주세요." })).toBeFocused();
  await page.getByRole("button", { name: "진단 결과 보기" }).click();
  await expect(page).toHaveURL(/\/tax\/result$/);
  await expect(page.getByText("체험 결과", { exact: true })).toBeVisible();
  await expect(
    page.getByText("현재 입력값만으로는 계산할 수 없습니다.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("서비스 수수료를 알 수 없어 차액을 계산하지 않았습니다."),
  ).toBeVisible();
  await page.getByLabel("비교할 서비스 수수료 (선택)").fill("15000");
  await expect(page.getByText(/직접 신고하면 입력하신 서비스 수수료 15,000원을/)).toBeVisible();
  await page.getByLabel("비교할 서비스 수수료 (선택)").fill("-1");
  await expect(page.getByText("수수료를 올바른 정수 금액으로 입력해 주세요.")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze()).violations,
  ).toEqual([]);
  expect(page.url()).not.toContain("10000000");
  expect(page.url()).not.toContain("?");
  expect(taxRequests).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: Object.keys(localStorage),
      session: Object.keys(sessionStorage),
    })),
  ).toEqual({ local: [], session: [] });
  await page.getByRole("link", { name: "입력 수정하기" }).click();
  await expect(page.getByLabel("소득 귀속연도 (필수)")).toHaveValue("2025");
  await page.reload();
  await expect(page.getByLabel("소득 귀속연도 (필수)")).toHaveValue("");
});

test("result refresh and clear remove private state; official guide remains usable", async ({
  page,
}) => {
  await fillTax(page, true);
  await page.getByRole("button", { name: "진단 결과 보기" }).click();
  await page.getByRole("button", { name: "입력값과 결과 지우기" }).click();
  await expect(page.getByRole("heading", { name: "아직 확인한 결과가 없어요." })).toBeVisible();
  await expect(page.getByRole("link", { name: "홈택스 바로가기" })).toHaveAttribute(
    "rel",
    "noopener noreferrer",
  );
  await page.reload();
  await expect(page.getByRole("heading", { name: "아직 확인한 결과가 없어요." })).toBeVisible();
});

test("SEO and not-found page", async ({ page, request }) => {
  await page.goto("/tax");
  await expect(page).toHaveTitle("종합소득세 환급 확인 | NeedIt?");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/tax$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /종합소득세/);
  const taxHTML = await (await request.get("/tax")).text();
  expect(taxHTML).toContain("홈택스에서 직접 확인하기");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/tax/result");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  await page.goto("/tax/result");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const response = await page.goto("/no-such-service");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "페이지를 찾지 못했어요." })).toBeVisible();
});
