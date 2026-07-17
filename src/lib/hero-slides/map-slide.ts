import {
  Star,
  Sparkles,
  LayoutGrid,
  Umbrella,
  Shield,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { HeroSlide } from "@/types";
import { resolveHeroSlideTag } from "./defaults";

const BADGE_ICONS: Record<string, LucideIcon> = {
  Star,
  Sparkles,
  LayoutGrid,
  Umbrella,
  Shield,
  Tag,
};

export interface HeroSlideView {
  id: string;
  tag: string;
  title: string;
  mobileTitle: string;
  highlight: string;
  mobileCta: string;
  description: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  productImage: string;
  productLabel: string;
  productPrice: string;
  badge: { icon: LucideIcon; text: string };
  stats: { value: string; label: string }[];
  leftBg: string;
  rightBg: string;
  accent: string;
  accentLight: string;
}

export function mapHeroSlide(slide: HeroSlide, shortName: string): HeroSlideView {
  return {
    id: slide.id,
    tag: resolveHeroSlideTag(slide.tag, shortName),
    title: slide.title,
    mobileTitle: slide.mobileTitle,
    highlight: slide.highlight,
    mobileCta: slide.mobileCta,
    description: slide.description,
    cta: { label: slide.ctaLabel, href: slide.ctaHref },
    secondary: { label: slide.secondaryLabel, href: slide.secondaryHref },
    productImage: slide.productImage,
    productLabel: slide.productLabel,
    productPrice: slide.productPrice,
    badge: {
      icon: BADGE_ICONS[slide.badgeIcon] ?? Star,
      text: slide.badgeText,
    },
    stats: [
      { value: slide.stat1Value, label: slide.stat1Label },
      { value: slide.stat2Value, label: slide.stat2Label },
      { value: slide.stat3Value, label: slide.stat3Label },
    ],
    leftBg: slide.leftBg,
    rightBg: slide.rightBg,
    accent: slide.accent,
    accentLight: slide.accentLight,
  };
}

export function mapHeroSlides(slides: HeroSlide[], shortName: string): HeroSlideView[] {
  return slides.map((slide) => mapHeroSlide(slide, shortName));
}
