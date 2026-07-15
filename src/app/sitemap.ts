import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/data/config";
import { getSeoConfig } from "@/lib/seo/config";
import { getProducts, getBlogPosts, getCategories } from "@/lib/data/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, products, blogs, categories] = await Promise.all([
    getSeoConfig(),
    getProducts(),
    getBlogPosts(),
    getCategories(),
  ]);

  const base = APP_URL.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const page of Object.values(config.pages)) {
    if (!page.sitemap || page.noindex) continue;
    entries.push({
      url: `${base}${page.path}`,
      lastModified: new Date(config.updatedAt),
      changeFrequency: page.changefreq,
      priority: page.priority,
    });
  }

  for (const path of ["/faq", "/track-order", "/returns", "/shipping"]) {
    entries.push({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  for (const product of products) {
    if (product.seo?.noindex) continue;
    entries.push({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const cat of categories.slice(0, 20)) {
    entries.push({
      url: `${base}/products?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const post of blogs) {
    if (post.seo?.noindex) continue;
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
