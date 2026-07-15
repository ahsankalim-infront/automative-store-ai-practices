import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/data/config";
import { getSeoConfig } from "@/lib/seo/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getSeoConfig();
  const base = APP_URL.replace(/\/$/, "");

  if (!config.global.robotsAllow) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/auth",
          "/auth/",
          "/checkout",
          "/cart",
          "/order-success",
          "/api",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
