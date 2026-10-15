import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/tax"].map((path) => ({
    url: new URL(path, siteUrl).href,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
