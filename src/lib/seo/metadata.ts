import type { Metadata } from "next";
import { APP_URL } from "@/lib/data/config";
import { getSeoConfig } from "./config";
import type { EntitySeo, SeoPageEntry, SeoPageKey } from "./types";

function absUrl(path: string): string {
  if (!path) return APP_URL;
  if (path.startsWith("http")) return path;
  return `${APP_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

function keywordsToMeta(keywords: string[]): string | string[] | undefined {
  if (!keywords.length) return undefined;
  return keywords;
}

function buildOpenGraph(
  title: string,
  description: string,
  url: string,
  image: string | undefined,
  siteName: string,
  locale: string
): Metadata["openGraph"] {
  return {
    type: "website",
    locale,
    siteName,
    title,
    description,
    url,
    ...(image ? { images: [{ url: absUrl(image), width: 1200, height: 630, alt: title }] } : {}),
  };
}

function buildTwitter(
  title: string,
  description: string,
  image: string | undefined,
  handle: string
): Metadata["twitter"] {
  return {
    card: image ? "summary_large_image" : "summary",
    title,
    description,
    ...(handle ? { site: handle.startsWith("@") ? handle : `@${handle}` } : {}),
    ...(image ? { images: [absUrl(image)] } : {}),
  };
}

function mergePageEntry(base: SeoPageEntry, override?: Partial<SeoPageEntry>): SeoPageEntry {
  if (!override) return base;
  return {
    ...base,
    ...override,
    keywords: override.keywords?.length ? override.keywords : base.keywords,
  };
}

/** Build Next.js Metadata for a static page key */
export async function buildPageMetadata(
  pageKey: SeoPageKey,
  override?: Partial<SeoPageEntry>
): Promise<Metadata> {
  const config = await getSeoConfig();
  const global = config.global;
  const page = mergePageEntry(config.pages[pageKey], override);

  const title = page.title || global.siteTitle;
  const description = page.description || global.defaultDescription;
  const keywords = page.keywords.length ? page.keywords : global.defaultKeywords;
  const ogImage = page.ogImage || global.defaultOgImage || undefined;
  const canonical = page.canonical || page.path;
  const url = absUrl(canonical);

  const metadata: Metadata = {
    title,
    description,
    keywords: keywordsToMeta(keywords),
    alternates: { canonical: url },
    openGraph: buildOpenGraph(title, description, url, ogImage, global.siteName, global.locale),
    twitter: buildTwitter(title, description, ogImage, global.twitterHandle),
    robots: page.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };

  if (global.googleSiteVerification) {
    metadata.verification = { google: global.googleSiteVerification };
  }

  return metadata;
}

/** Build metadata for a product detail page */
export async function buildProductMetadata(product: {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: { url: string; alt: string; isPrimary?: boolean }[];
  category: string;
  tags: string[];
  seo?: EntitySeo;
}): Promise<Metadata> {
  const config = await getSeoConfig();
  const global = config.global;
  const seo = product.seo;

  const title =
    seo?.metaTitle ||
    `${product.name} — ${product.category}`;
  const description =
    seo?.metaDescription ||
    product.shortDescription ||
    product.description.slice(0, 160);
  const keywords = seo?.keywords?.length
    ? seo.keywords
    : [...product.tags, product.category, product.name].filter(Boolean);
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const ogImage = seo?.ogImage || primary?.url || global.defaultOgImage || undefined;
  const path = `/products/${product.slug}`;
  const url = absUrl(path);
  const noindex = seo?.noindex ?? false;

  return {
    title,
    description,
    keywords: keywordsToMeta(keywords),
    alternates: { canonical: url },
    openGraph: buildOpenGraph(title, description, url, ogImage, global.siteName, global.locale),
    twitter: buildTwitter(title, description, ogImage, global.twitterHandle),
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/** Build metadata for a blog post */
export async function buildBlogMetadata(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  seo?: EntitySeo;
}): Promise<Metadata> {
  const config = await getSeoConfig();
  const global = config.global;
  const seo = post.seo;

  const title = seo?.metaTitle || post.title;
  const description =
    seo?.metaDescription ||
    post.excerpt ||
    post.content.replace(/<[^>]+>/g, "").slice(0, 160);
  const keywords = seo?.keywords?.length ? seo.keywords : post.tags ?? [];
  const ogImage = seo?.ogImage || post.coverImage || global.defaultOgImage || undefined;
  const path = `/blog/${post.slug}`;
  const url = absUrl(path);

  return {
    title,
    description,
    keywords: keywordsToMeta(keywords),
    alternates: { canonical: url },
    openGraph: buildOpenGraph(title, description, url, ogImage, global.siteName, global.locale),
    twitter: buildTwitter(title, description, ogImage, global.twitterHandle),
    robots: seo?.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/** Root layout defaults from SEO config */
export async function buildRootMetadata(): Promise<Metadata> {
  const config = await getSeoConfig();
  const g = config.global;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: g.siteTitle,
      template: g.titleTemplate,
    },
    description: g.defaultDescription,
    keywords: keywordsToMeta(g.defaultKeywords),
    openGraph: {
      type: "website",
      locale: g.locale,
      siteName: g.siteName,
      title: g.siteTitle,
      description: g.defaultDescription,
      ...(g.defaultOgImage
        ? { images: [{ url: absUrl(g.defaultOgImage), width: 1200, height: 630 }] }
        : {}),
    },
    twitter: buildTwitter(g.siteTitle, g.defaultDescription, g.defaultOgImage, g.twitterHandle),
    verification: {
      ...(g.googleSiteVerification ? { google: g.googleSiteVerification } : {}),
      ...(g.bingSiteVerification ? { other: { "msvalidate.01": g.bingSiteVerification } } : {}),
    },
  };
}

export { absUrl };
