export const HOME_SECTION_KEYS = [
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
] as const;

export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export interface HomeSectionConfig {
  id: HomeSectionKey;
  enabled: boolean;
}

export interface HomeLayoutConfig {
  id: string;
  desktop: HomeSectionConfig[];
  mobile: HomeSectionConfig[];
  updatedAt: string;
}
