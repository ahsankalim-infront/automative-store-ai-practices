import {
  Armchair,
  Bike,
  Calendar,
  Car,
  Circle,
  LayoutGrid,
  Lightbulb,
  Lock,
  Music,
  Package,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Tag,
  Umbrella,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Lucide icon names allowed for categories (stored in DB / JSON as PascalCase string). */
export const CATEGORY_ICON_OPTIONS = [
  { value: "LayoutGrid", label: "Grid / Mats" },
  { value: "Umbrella", label: "Umbrella / Cover" },
  { value: "Armchair", label: "Seat / Interior" },
  { value: "Car", label: "Car" },
  { value: "Lightbulb", label: "Lighting" },
  { value: "Sparkles", label: "Sparkles / Care" },
  { value: "Wrench", label: "Wrench / Service" },
  { value: "Smartphone", label: "Gadgets" },
  { value: "Shield", label: "Shield / PPF" },
  { value: "Zap", label: "Performance" },
  { value: "Package", label: "Package" },
  { value: "Circle", label: "Wheels" },
  { value: "Wind", label: "Perfume" },
  { value: "Music", label: "Music" },
  { value: "Lock", label: "Security" },
  { value: "Bike", label: "Bike" },
  { value: "Settings", label: "Parts / Settings" },
  { value: "Calendar", label: "Calendar / Booking" },
  { value: "Tag", label: "Tag / Default" },
] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutGrid,
  Umbrella,
  Armchair,
  Car,
  Lightbulb,
  Sparkles,
  Wrench,
  Smartphone,
  Shield,
  Zap,
  Package,
  Circle,
  Wind,
  Music,
  Lock,
  Bike,
  Settings,
  Calendar,
  Tag,
};

export function resolveLucideIcon(name?: string | null, fallback: LucideIcon = Tag): LucideIcon {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

export function CategoryLucideIcon({
  name,
  className,
  fallback = Tag,
}: {
  name?: string | null;
  className?: string;
  fallback?: LucideIcon;
}) {
  const Icon = resolveLucideIcon(name, fallback);
  return <Icon className={className} aria-hidden />;
}
