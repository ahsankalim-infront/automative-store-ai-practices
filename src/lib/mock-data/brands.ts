import type { Brand } from "@/types";

// Logo placeholder using brand initials on colored backgrounds
const logo = (text: string, bg: string) =>
  `https://placehold.co/160x80/${bg.replace("#", "")}/ffffff?text=${encodeURIComponent(text)}&font=montserrat`;

export const brands: Brand[] = [
  { id: "brand-1", slug: "maximus", name: "Maximus", logo: logo("MAXIMUS", "#D50000"), productCount: 450, isPrivateLabel: true, country: "Pakistan", description: "Premium private label brand by AutoZone" },
  { id: "brand-2", slug: "redline", name: "Redline", logo: logo("REDLINE", "#B91C1C"), productCount: 89, isPrivateLabel: false, country: "USA" },
  { id: "brand-3", slug: "dlaa", name: "DLAA", logo: logo("DLAA", "#1E3A5F"), productCount: 134, isPrivateLabel: false, country: "China" },
  { id: "brand-4", slug: "bosoko", name: "Bosoko", logo: logo("BOSOKO", "#1F2937"), productCount: 67, isPrivateLabel: false, country: "China" },
  { id: "brand-5", slug: "vland", name: "Vland", logo: logo("VLAND", "#374151"), productCount: 56, isPrivateLabel: false, country: "China" },
  { id: "brand-6", slug: "3m", name: "3M", logo: logo("3M", "#CC0000"), productCount: 45, isPrivateLabel: false, country: "USA" },
  { id: "brand-7", slug: "bosch", name: "Bosch", logo: logo("BOSCH", "#005691"), productCount: 78, isPrivateLabel: false, country: "Germany" },
  { id: "brand-8", slug: "kenwood", name: "Kenwood", logo: logo("KENWOOD", "#0A2240"), productCount: 34, isPrivateLabel: false, country: "Japan" },
  { id: "brand-9", slug: "pioneer", name: "Pioneer", logo: logo("PIONEER", "#000000"), productCount: 28, isPrivateLabel: false, country: "Japan" },
  { id: "brand-10", slug: "garmin", name: "Garmin", logo: logo("GARMIN", "#007DC5"), productCount: 22, isPrivateLabel: false, country: "USA" },
];
