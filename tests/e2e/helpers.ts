import { expect, type Page } from "@playwright/test";
export async function fillTax(page: Page, unknown = false) {
  await page.goto("/tax/check");
  await page.getByLabel("소득 귀속연도 (필수)").selectOption("2025");
  await page.getByRole("button", { name: "다음" }).click();
  await page.getByLabel("프리랜서 / 사업소득").check();
  await page.getByRole("button", { name: "다음" }).click();
  await page.getByLabel("총수입금액 (필수)").fill("10000000");
  if (unknown) await page.getByLabel("원천징수세액을 모르겠어요").check();
  else await page.getByLabel("원천징수세액 (필수)").fill("330000");
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByRole("heading", { name: "입력한 내용을 확인해 주세요." })).toBeVisible();
}
