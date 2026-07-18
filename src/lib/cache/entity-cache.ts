import { revalidateTag } from "next/cache";

/**
 * Maps logical resources / collection names → Next.js cache tags to invalidate
 * after create / update / delete.
 */
const ENTITY_CACHE_TAGS: Record<string, string[]> = {
  products: ["products"],
  categories: ["categories"],
  brands: ["brands"],
  "vehicle-makes": ["vehicles"],
  vehicles: ["vehicles"],
  blogs: ["blogs"],
  services: ["services"],
  stores: ["stores"],
  banners: ["banners"],
  bundleOffers: ["bundle-offers"],
  "bundle-offers": ["bundle-offers"],
  aboutTeam: ["about-team", "about-content"],
  "about-team": ["about-team", "about-content"],
  aboutMilestones: ["about-milestones", "about-content"],
  "about-milestones": ["about-milestones", "about-content"],
  heroSlides: ["hero-slides"],
  "hero-slides": ["hero-slides"],
  promotionPopups: ["promotion-popups"],
  "promotion-popups": ["promotion-popups"],
  // Reviews change product rating aggregates shown on storefront
  reviews: ["products"],
  // Settings / brand
  settings: ["store-settings"],
  seo: ["seo"],
  "home-layout": ["home-layout"],
  "bundle-offers-section": ["bundle-offers-section", "bundle-offers"],
  "about-journey-section": ["about-journey-section", "about-content"],
  "about-leadership-section": ["about-leadership-section", "about-content"],
  // Not currently tagged with unstable_cache — kept for completeness / future tags
  orders: ["orders"],
  coupons: ["coupons"],
  bookings: ["bookings"],
  contactMessages: ["contact-messages"],
  "contact-messages": ["contact-messages"],
  customers: ["users"],
  users: ["users"],
  newsletter: ["newsletter-subscribers"],
  "newsletter-subscribers": ["newsletter-subscribers"],
  notifications: ["notifications"],
  "push-subscriptions": ["push-subscriptions"],
  "activity-logs": ["activity-logs"],
  analytics: ["analytics"],
};

/** Invalidate cache tags for a resource after add / edit / delete. */
export function revalidateEntityCache(resource: string): string[] {
  const tags = ENTITY_CACHE_TAGS[resource];
  if (!tags?.length) return [];
  for (const tag of tags) {
    revalidateTag(tag, "default");
  }
  return tags;
}

export function getEntityCacheTags(resource: string): string[] {
  return ENTITY_CACHE_TAGS[resource] ?? [];
}
