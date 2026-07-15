export interface EntitySeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
}

export interface SeoGlobalSettings {
  siteName: string;
  siteTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  twitterHandle: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  robotsAllow: boolean;
  organizationName: string;
  organizationLogo: string;
  locale: string;
  /** Extra robots.txt lines after defaults */
  robotsExtra: string;
}

export interface SeoPageEntry {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
  noindex: boolean;
  /** Include in XML sitemap */
  sitemap: boolean;
  /** Sitemap priority 0.0–1.0 */
  priority: number;
  /** Sitemap changefreq */
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

export type SeoPageKey =
  | "home"
  | "products"
  | "about"
  | "contact"
  | "terms"
  | "services"
  | "servicesBook"
  | "blog"
  | "storeLocator"
  | "cart"
  | "checkout"
  | "authLogin"
  | "authRegister"
  | "dashboard"
  | "orderSuccess";

export interface SeoConfig {
  id: string;
  global: SeoGlobalSettings;
  pages: Record<SeoPageKey, SeoPageEntry>;
  updatedAt: string;
}

export interface SeoPageRow {
  id: string;
  page_key: string;
  path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
  canonical: string | null;
  noindex: boolean;
  sitemap: boolean;
  priority: number;
  changefreq: string;
  updated_at: string;
}
