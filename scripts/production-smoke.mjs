import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const origin = "http://127.0.0.1:3310";
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3310"],
  { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
);
let serverLog = "";
server.stdout.on("data", (chunk) => {
  serverLog += chunk;
});
server.stderr.on("data", (chunk) => {
  serverLog += chunk;
});
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(serverLog);
    try {
      ready = (await fetch(origin)).ok;
    } catch {
      /* Server is starting. */
    }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert(ready, "Production server did not become ready");
  for (const path of [
    "/",
    "/tax",
    "/tax/check",
    "/tax/result",
    "/sitemap.xml",
    "/robots.txt",
    "/icon.svg",
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
  const og = await fetch(origin + "/opengraph-image");
  assert(og.ok, "Open Graph PNG should render");
  assert.match(og.headers.get("content-type"), /image\/png/);
  assert((await og.arrayBuffer()).byteLength > 1000);
  browser = await chromium.launch();
  await mkdir("test-results", { recursive: true });
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    assert.match(await page.title(), /NeedIt/);
    assert(await page.getByRole("heading", { level: 1 }).isVisible());
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    await page.getByRole("link", { name: "직접 확인하기" }).click();
    await page.getByRole("link", { name: "진단 시작하기" }).click();
    await page.getByLabel("소득 귀속연도 (필수)").selectOption("2025");
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByLabel("프리랜서 / 사업소득").check();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByLabel("총수입금액 (필수)").fill("10000000");
    await page.getByLabel("원천징수세액을 모르겠어요").check();
    await page.getByRole("button", { name: "다음" }).click();
    await page.getByRole("button", { name: "진단 결과 보기" }).click();
    await page.getByRole("heading", { name: "추가로 확인할 정보가 있어요." }).waitFor();
    await page.screenshot({ path: `test-results/result-${width}.png`, fullPage: true });
    assert.deepEqual(errors, [], "No hydration or runtime errors");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    console.log(
      `Production ${width}px: home → tax → form → result passed; no runtime errors or horizontal overflow.`,
    );
    await context.close();
  }
  console.log("Production routes, response headers, Open Graph PNG and browser flow passed.");
} finally {
  await browser?.close();
  server.kill();
}
