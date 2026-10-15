import { afterEach, expect, it, vi } from "vitest";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
it("public origin has canonical sitemap and excludes private routes", async () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://needit.example");
  vi.resetModules();
  const { default: sitemap } = await import("@/app/sitemap");
  const { default: robots } = await import("@/app/robots");
  expect(sitemap().map((item) => item.url)).toEqual([
    "https://needit.example/",
    "https://needit.example/tax",
  ]);
  expect(robots()).toEqual({
    rules: { userAgent: "*", allow: "/", disallow: ["/tax/check", "/tax/result"] },
    sitemap: "https://needit.example/sitemap.xml",
  });
});
