import type { HomeLayoutConfig, HomeSectionConfig, HomeSectionKey } from "./types";
import { HOME_SECTION_KEYS } from "./types";

export const HOME_SECTION_LABELS: Record<HomeSectionKey, string> = {
  hero: "Hero Banner & Promo Cards",
  why_choose_us: "Why Choose Us",
  signature_showcase: "Signature Collection",
  vehicle_selector: "Vehicle Selector",
  categories: "Shop by Category",
  top_products: "Top Products",
  shop_by_car: "Shop by Car",
  flash_sale: "Flash Sale",
  best_sellers: "Best Sellers",
  shop_by_brand: "Shop by Brand",
  bundle_offers: "Bundle Offers",
  ppf_services: "PPF & Services Banner",
  new_arrivals: "New Arrivals",
  customer_reviews: "Customer Reviews",
  blog: "Blog",
  newsletter: "Newsletter",
};

/** Current desktop homepage order */
const DESKTOP_ORDER: HomeSectionKey[] = [
  "hero",
  "why_choose_us",
  "signature_showcase",
  "vehicle_selector",
  "categories",
  "top_products",
  "shop_by_car",
  "flash_sale",
  "best_sellers",
  "shop_by_brand",
  "bundle_offers",
  "ppf_services",
  "new_arrivals",
  "customer_reviews",
  "blog",
  "newsletter",
];

/** Mobile: banner → Top Products → Shop by Category → Best Sellers → rest */
const MOBILE_ORDER: HomeSectionKey[] = [
  "hero",
  "top_products",
  "categories",
  "best_sellers",
  "why_choose_us",
  "signature_showcase",
  "vehicle_selector",
  "flash_sale",
  "shop_by_car",
  "shop_by_brand",
  "bundle_offers",
  "ppf_services",
  "new_arrivals",
  "customer_reviews",
  "blog",
  "newsletter",
];

function buildSections(order: HomeSectionKey[]): HomeSectionConfig[] {
  const seen = new Set<HomeSectionKey>();
  const list: HomeSectionConfig[] = order.map((id) => {
    seen.add(id);
    return { id, enabled: true };
  });
  for (const id of HOME_SECTION_KEYS) {
    if (!seen.has(id)) list.push({ id, enabled: true });
  }
  return list;
}

export const DEFAULT_HOME_LAYOUT: HomeLayoutConfig = {
  id: "home-layout-1",
  desktop: buildSections(DESKTOP_ORDER),
  mobile: buildSections(MOBILE_ORDER),
  updatedAt: new Date().toISOString(),
};

export function normalizeSectionList(
  input: HomeSectionConfig[] | undefined,
  fallback: HomeSectionConfig[]
): HomeSectionConfig[] {
  if (!input?.length) return fallback;

  const seen = new Set<HomeSectionKey>();
  const merged: HomeSectionConfig[] = [];

  for (const item of input) {
    if (!HOME_SECTION_KEYS.includes(item.id) || seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push({ id: item.id, enabled: item.enabled !== false });
  }

  for (const id of HOME_SECTION_KEYS) {
    if (!seen.has(id)) merged.push({ id, enabled: true });
  }

  return merged;
}

export function resolveActiveSections(list: HomeSectionConfig[]): HomeSectionKey[] {
  return list.filter((s) => s.enabled).map((s) => s.id);
}
