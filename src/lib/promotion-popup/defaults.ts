import type { PromotionPopup } from "@/types";

export const DEFAULT_PROMOTION_POPUPS: PromotionPopup[] = [
  {
    id: "promo-popup-1",
    title: "Premium Seat Covers",
    subtitle: "Custom fit · PU/PVC leather",
    description:
      "Get 10% off your first custom seat cover order. Expert fitting at our Lahore studio — all colours available.",
    badgeText: "Limited Offer",
    couponCode: "SPH10",
    image:
      "https://images.unsplash.com/photo-1760161339261-56487b766a17?auto=format&fit=crop&w=800&h=600&q=85",
    ctaLabel: "Shop Seat Covers",
    ctaHref: "/products?category=custom-seat-covers",
    secondaryLabel: "Maybe later",
    accentColor: "#D50000",
    isActive: true,
    sortOrder: 0,
    showDelayMs: 1200,
    dismissDays: 3,
    validFrom: "2026-01-01T00:00:00.000Z",
    validTo: "2026-12-31T23:59:59.000Z",
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
  },
];
