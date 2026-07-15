import type { LucideIcon } from "lucide-react";
import { Car, LayoutGrid, Sparkles, Umbrella } from "lucide-react";
import { SIGNATURE_IMAGES } from "@/lib/brand/signature-images";

export interface SignatureCategory {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  accent: string;
  accentLight: string;
  icon: LucideIcon;
  badge: string;
  highlights: string[];
  featured?: boolean;
}

/** Shahzad Poshish House — top signature product lines for the landing page */
export const SIGNATURE_CATEGORIES: SignatureCategory[] = [
  {
    id: "sig-seat-covers",
    slug: "custom-seat-covers",
    title: "Custom Made Car Seat Covers",
    subtitle: "Top Premium Quality Leather PU/PVC",
    description:
      "Handcrafted custom-fit seat covers in premium PU & PVC leather. Available in all colours with diamond stitching, airbag-safe design & expert fitting at our Lahore studio.",
    href: "/products?category=custom-seat-covers",
    image: SIGNATURE_IMAGES.seatCovers,
    accent: "#D50000",
    accentLight: "#ff5252",
    icon: Sparkles,
    badge: "★ #1 Best Seller",
    highlights: ["All colours", "PU & PVC leather", "Custom fit", "Expert installation"],
    featured: true,
  },
  {
    id: "sig-top-cover",
    slug: "car-top-cover",
    title: "Car Top Cover",
    subtitle: "Sun · Dust · Rain Protection",
    description:
      "Durable all-weather car top covers that shield your vehicle from harsh sun, dust, bird droppings and rain. Universal & custom sizes available.",
    href: "/products?category=car-top-cover",
    image: SIGNATURE_IMAGES.topCover,
    accent: "#2563EB",
    accentLight: "#93C5FD",
    icon: Umbrella,
    badge: "All Weather",
    highlights: ["UV resistant", "Waterproof", "Breathable fabric", "Elastic hem"],
  },
  {
    id: "sig-floor-matting",
    slug: "car-floor-matting",
    title: "Car Floor Matting",
    subtitle: "Custom 5D · 7D · 9D Mats",
    description:
      "Precision-cut floor matting for every car model. High-wall 5D/7D design traps dirt & spills. Odourless, waterproof and easy to clean.",
    href: "/products?category=car-floor-matting",
    image: SIGNATURE_IMAGES.floorMatting,
    accent: "#059669",
    accentLight: "#6EE7B7",
    icon: LayoutGrid,
    badge: "Custom Fit",
    highlights: ["5D/7D/9D options", "Anti-slip base", "200+ models", "Easy clean"],
  },
  {
    id: "sig-top-cover-premium",
    slug: "car-top-cover",
    title: "Car Top Cover",
    subtitle: "Premium Fitted · Heavy Duty",
    description:
      "Premium fitted car top covers with soft inner lining to protect paint. Double-stitched seams, mirror pockets & storage bag included.",
    href: "/products?category=car-top-cover",
    image: SIGNATURE_IMAGES.topCoverPremium,
    accent: "#7C3AED",
    accentLight: "#C4B5FD",
    icon: Car,
    badge: "Premium Line",
    highlights: ["Paint-safe lining", "Mirror pockets", "Double stitched", "Storage bag"],
  },
];

export const SIGNATURE_CATEGORY_SLUGS = [
  "car-top-cover",
  "car-floor-matting",
  "custom-seat-covers",
] as const;
