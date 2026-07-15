import { BRAND_LOGO_SRC } from "@/lib/brand/assets";
import { BRAND } from "@/lib/brand/config";
import type { SeoConfig, SeoGlobalSettings, SeoPageEntry, SeoPageKey } from "./types";

const SITE = BRAND.name;

export const DEFAULT_SEO_GLOBAL: SeoGlobalSettings = {
  siteName: SITE,
  siteTitle: `${SITE} — Car Poshish, Seat Covers & Floor Matting Lahore`,
  titleTemplate: `%s | ${SITE}`,
  defaultDescription:
    `${SITE} — custom car seat covers (PU/PVC leather), car top covers, floor matting & interior poshish. ${BRAND.address.full}. Call ${BRAND.primaryPhone}.`,
  defaultKeywords: [
    "car seat covers lahore",
    "car poshish",
    "car top cover",
    "car floor matting",
    "custom seat covers",
    "PU leather seat covers",
    "automotive upholstery lahore",
    "shahzad poshish house",
  ],
  defaultOgImage: BRAND_LOGO_SRC,
  twitterHandle: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
  robotsAllow: true,
  organizationName: SITE,
  organizationLogo: BRAND_LOGO_SRC,
  locale: "en_PK",
  robotsExtra: "",
};

function page(
  path: string,
  title: string,
  description: string,
  keywords: string[],
  opts: Partial<SeoPageEntry> = {}
): SeoPageEntry {
  return {
    path,
    title,
    description,
    keywords,
    ogImage: "",
    canonical: "",
    noindex: false,
    sitemap: true,
    priority: 0.7,
    changefreq: "weekly",
    ...opts,
  };
}

export const DEFAULT_SEO_PAGES: Record<SeoPageKey, SeoPageEntry> = {
  home: page(
    "/",
    `${SITE} — Premium Car Seat Covers, Top Covers & Floor Matting`,
    `Shop custom made car seat covers, car top covers and car floor matting at ${SITE}. Premium PU/PVC leather in all colours. Expert fitting in Lahore.`,
    ["car seat covers", "car top cover", "car floor matting", "poshish lahore"],
    { priority: 1.0, changefreq: "daily" }
  ),
  products: page(
    "/products",
    "Shop All Products — Seat Covers, Top Covers & Mats",
    "Browse car seat covers, top covers, floor matting, LED lights and automotive accessories. Free delivery on orders above Rs. 1,500.",
    ["automotive products", "car accessories pakistan", "seat covers online"],
    { priority: 0.9, changefreq: "daily" }
  ),
  about: page(
    "/about",
    "About Us — Lahore's Trusted Car Poshish Experts",
    `Learn about ${SITE} — premium car poshish, seat covers and interior upholstery since 2012. Visit us at ${BRAND.address.full}.`,
    ["about shahzad poshish", "car upholstery lahore"]
  ),
  contact: page(
    "/contact",
    "Contact Us — Get a Free Quote",
    `Contact ${SITE} for custom seat covers, floor matting and top covers. Call ${BRAND.primaryPhone} or visit ${BRAND.address.city}.`,
    ["contact car seat covers lahore", "poshish quote"]
  ),
  terms: page(
    "/terms",
    "Terms, Shipping & Returns Policy",
    "Read our terms and conditions, shipping policy, returns, warranty and privacy information for Shahzad Poshish House.",
    ["terms and conditions", "shipping policy", "returns policy"]
  ),
  services: page(
    "/services",
    "Installation & Poshish Services",
    "Professional seat cover fitting, interior upholstery and automotive services at Shahzad Poshish House, Lahore.",
    ["car seat cover installation", "poshish services lahore"]
  ),
  servicesBook: page(
    "/services/book",
    "Book a Service Appointment",
    "Book seat cover fitting, interior upholstery or other automotive services online at Shahzad Poshish House.",
    ["book car service lahore"],
    { noindex: true, sitemap: false }
  ),
  blog: page(
    "/blog",
    "Blog — Car Care & Poshish Tips",
    "Expert tips on car seat covers, floor matting, interior care and automotive accessories from Shahzad Poshish House.",
    ["car care blog", "automotive tips pakistan"]
  ),
  storeLocator: page(
    "/store-locator",
    "Store Locator — Visit Our Lahore Office",
    `Find ${SITE} at ${BRAND.address.full}. Open ${BRAND.businessHours}.`,
    ["shahzad poshish location", "car seat covers shop lahore"]
  ),
  cart: {
    path: "/cart",
    title: "Shopping Cart",
    description: "Your cart at Shahzad Poshish House.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
  checkout: {
    path: "/checkout",
    title: "Checkout",
    description: "Secure checkout at Shahzad Poshish House.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
  authLogin: {
    path: "/auth/login",
    title: "Customer Login",
    description: "Sign in to your Shahzad Poshish House account.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
  authRegister: {
    path: "/auth/register",
    title: "Create Account",
    description: "Register for a Shahzad Poshish House account.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
  dashboard: {
    path: "/dashboard",
    title: "My Account",
    description: "Customer dashboard at Shahzad Poshish House.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
  orderSuccess: {
    path: "/order-success",
    title: "Order Confirmed",
    description: "Thank you for your order at Shahzad Poshish House.",
    keywords: [],
    ogImage: "",
    canonical: "",
    noindex: true,
    sitemap: false,
    priority: 0.3,
    changefreq: "monthly",
  },
};

export const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  home: "Homepage",
  products: "Products Listing",
  about: "About Us",
  contact: "Contact",
  terms: "Terms & Policies",
  services: "Services",
  servicesBook: "Book Service",
  blog: "Blog",
  storeLocator: "Store Locator",
  cart: "Cart",
  checkout: "Checkout",
  authLogin: "Login",
  authRegister: "Register",
  dashboard: "Customer Dashboard",
  orderSuccess: "Order Success",
};

export const DEFAULT_SEO_CONFIG: SeoConfig = {
  id: "seo-config-1",
  global: DEFAULT_SEO_GLOBAL,
  pages: DEFAULT_SEO_PAGES,
  updatedAt: new Date().toISOString(),
};
