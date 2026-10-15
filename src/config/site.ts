const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const siteUrl = new URL(origin);
export const isPublicSite = siteUrl.hostname !== "localhost" && siteUrl.hostname !== "127.0.0.1";
