import type { MetadataRoute } from "next";
import { siteUrl, isPublicSite } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(isPublicSite
        ? { allow: "/", disallow: ["/tax/check", "/tax/result"] }
        : { disallow: "/" }),
    },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
