"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppImage as Image } from "@/components/ui/app-image";
import { SectionHeader } from "@/components/shared/section-header";
import { SIGNATURE_CATEGORY_SLUGS } from "@/lib/brand/signature-categories";
import type { Category } from "@/types";

const SIGNATURE_SLUG_SET = new Set<string>(SIGNATURE_CATEGORY_SLUGS);

/* ── Per-category icon SVGs + accent colors ──────────────────────────────── */
const categoryConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  "car-top-cover": {
    color: "#2563EB", bg: "#DBEAFE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <path d="M8 24 Q20 10 32 24" stroke="#2563EB" strokeWidth="2" fill="#2563EB" opacity="0.15"/>
        <path d="M10 24 L30 24" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 24 L14 18 L26 18 L28 24" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.2"/>
        <ellipse cx="20" cy="28" rx="12" ry="3" fill="#2563EB" opacity="0.2"/>
      </svg>
    ),
  },
  "car-floor-matting": {
    color: "#059669", bg: "#D1FAE5",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="5" y="10" width="30" height="22" rx="3" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.5"/>
        <line x1="5" y1="16" x2="35" y2="16" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="5" y1="22" x2="35" y2="22" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="11" y1="10" x2="11" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="23" y1="10" x2="23" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
      </svg>
    ),
  },
  "custom-seat-covers": {
    color: "#D50000", bg: "#FEE2E2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <path d="M8 20 Q8 14 14 14 H26 Q32 14 32 20 V28 H8 Z" fill="#D50000" opacity="0.2"/>
        <path d="M8 20 Q8 14 14 14 H26 Q32 14 32 20" stroke="#D50000" strokeWidth="1.5" fill="none"/>
        <path d="M8 22 Q11 26 20 26 Q29 26 32 22" stroke="#D50000" strokeWidth="1.5" fill="none"/>
        <rect x="10" y="26" width="7" height="5" rx="1.5" fill="#D50000" opacity="0.4"/>
        <rect x="23" y="26" width="7" height="5" rx="1.5" fill="#D50000" opacity="0.4"/>
      </svg>
    ),
  },
  "led-lighting": {
    color: "#F59E0B", bg: "#FEF3C7",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <ellipse cx="20" cy="24" rx="8" ry="4" fill="#FCD34D" opacity="0.4"/>
        <path d="M20 6C14.477 6 10 10.477 10 16c0 3.6 1.9 6.77 4.75 8.62V28h10.5v-3.38A10 10 0 0 0 30 16c0-5.523-4.477-10-10-10Z" fill="#F59E0B"/>
        <path d="M20 8c-4.418 0-8 3.582-8 8 0 2.9 1.54 5.45 3.85 6.92" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        <rect x="14.75" y="28" width="10.5" height="2" rx="1" fill="#D97706"/>
        <rect x="15.75" y="31" width="8.5" height="2" rx="1" fill="#D97706"/>
        <line x1="20" y1="2" x2="20" y2="4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <line x1="30.5" y1="6" x2="29" y2="7.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <line x1="9.5" y1="6" x2="11" y2="7.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="16" x2="36" y2="16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <line x1="4" y1="16" x2="6" y2="16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  "exterior": {
    color: "#3B82F6", bg: "#DBEAFE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <path d="M8 22l4-8h16l4 8" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="5" y="22" width="30" height="8" rx="2" fill="#3B82F6"/>
        <path d="M12 14l2-5h12l2 5" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1"/>
        <circle cx="11" cy="31" r="3.5" fill="#1E3A8A" stroke="#BFDBFE" strokeWidth="1"/>
        <circle cx="11" cy="31" r="1.5" fill="#BFDBFE"/>
        <circle cx="29" cy="31" r="3.5" fill="#1E3A8A" stroke="#BFDBFE" strokeWidth="1"/>
        <circle cx="29" cy="31" r="1.5" fill="#BFDBFE"/>
        <rect x="6" y="22" width="6" height="4" rx="1" fill="#93C5FD" opacity="0.7"/>
        <rect x="28" y="22" width="6" height="4" rx="1" fill="#93C5FD" opacity="0.7"/>
        <rect x="14" y="22" width="12" height="4" rx="1" fill="#BAE6FD" opacity="0.5"/>
        <circle cx="5" cy="24" r="1.5" fill="#FCD34D"/>
        <circle cx="35" cy="24" r="1.5" fill="#FCA5A5"/>
      </svg>
    ),
  },
  "interior": {
    color: "#8B5CF6", bg: "#EDE9FE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="5" y="12" width="30" height="20" rx="3" fill="#8B5CF6" opacity="0.15"/>
        <path d="M8 20 Q8 14 14 14 H26 Q32 14 32 20 V28 H8 Z" fill="#8B5CF6" opacity="0.3"/>
        <path d="M8 20 Q8 14 14 14 H26 Q32 14 32 20" stroke="#8B5CF6" strokeWidth="1.5" fill="none"/>
        <path d="M8 22 Q11 26 20 26 Q29 26 32 22" stroke="#7C3AED" strokeWidth="1.5" fill="none"/>
        <rect x="10" y="26" width="7" height="5" rx="1.5" fill="#7C3AED" opacity="0.5"/>
        <rect x="23" y="26" width="7" height="5" rx="1.5" fill="#7C3AED" opacity="0.5"/>
        <circle cx="20" cy="10" r="4" fill="none" stroke="#8B5CF6" strokeWidth="1.5"/>
        <circle cx="20" cy="10" r="1.5" fill="#8B5CF6"/>
        <line x1="16.5" y1="8.5" x2="20" y2="10" stroke="#8B5CF6" strokeWidth="1" strokeLinecap="round"/>
        <line x1="20" y1="10" x2="22" y2="7.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  "car-care": {
    color: "#10B981", bg: "#D1FAE5",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <path d="M24 6h-8a2 2 0 0 0-2 2v4h12V8a2 2 0 0 0-2-2Z" fill="#10B981"/>
        <rect x="12" y="12" width="16" height="20" rx="2" fill="#34D399"/>
        <path d="M16 16h8M16 20h8M16 24h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M25 30 Q28 28 28 24 Q30 22 32 24 Q32 30 28 33Z" fill="#10B981" stroke="#059669" strokeWidth="0.5"/>
        <circle cx="28" cy="22" r="1.5" fill="#6EE7B7"/>
      </svg>
    ),
  },
  "modifications": {
    color: "#EF4444", bg: "#FEE2E2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <path d="M28 8a6 6 0 0 1 2 10l-14 14a3 3 0 1 1-4-4L26 14a6 6 0 0 1 2-6Z" fill="#EF4444"/>
        <circle cx="30" cy="11" r="3" fill="#FCA5A5"/>
        <circle cx="10" cy="31" r="2.5" fill="#FCA5A5"/>
        <path d="M8 6l4 4-2 2-4-4a2 2 0 0 1 0-2.83A2 2 0 0 1 8 6Z" fill="#DC2626"/>
        <path d="M32 34l-4-4 2-2 4 4a2 2 0 1 1-2 2Z" fill="#DC2626"/>
      </svg>
    ),
  },
  "gadgets": {
    color: "#06B6D4", bg: "#CFFAFE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="8" y="6" width="24" height="28" rx="3" fill="#06B6D4"/>
        <rect x="10" y="9" width="20" height="18" rx="1.5" fill="#CFFAFE"/>
        <rect x="17" y="30" width="6" height="1.5" rx="0.75" fill="#CFFAFE"/>
        <rect x="12" y="11" width="16" height="14" rx="1" fill="#0E7490" opacity="0.3"/>
        <path d="M15 18 L18 15 L21 18 L24 13" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="20" r="1" fill="#67E8F9"/>
        <circle cx="17.5" cy="20" r="1" fill="#67E8F9"/>
        <circle cx="21" cy="20" r="1" fill="#67E8F9"/>
      </svg>
    ),
  },
  "paint-protection-film": {
    color: "#6366F1", bg: "#E0E7FF",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <path d="M20 4L6 10v12c0 7.73 5.98 14.97 14 17 8.02-2.03 14-9.27 14-17V10L20 4Z" fill="#6366F1" opacity="0.2"/>
        <path d="M20 4L6 10v12c0 7.73 5.98 14.97 14 17 8.02-2.03 14-9.27 14-17V10L20 4Z" stroke="#6366F1" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M13 20l5 5 9-10" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 8L9 13v9c0 5.2 4 10.1 11 12 7-1.9 11-6.8 11-12v-9L20 8Z" fill="#6366F1" opacity="0.1"/>
      </svg>
    ),
  },
  "performance": {
    color: "#F97316", bg: "#FFEDD5",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <path d="M6 28 A15 15 0 0 1 34 28" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M6 28 A15 15 0 0 1 20 13" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <line x1="20" y1="28" x2="14" y2="18" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="28" r="2.5" fill="#F97316"/>
        <text x="8" y="36" fill="#9CA3AF" fontSize="5" fontWeight="bold">0</text>
        <text x="31" y="36" fill="#9CA3AF" fontSize="5" fontWeight="bold">∞</text>
        <path d="M22 8l-4 8h3l-3 8" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  "utilities": {
    color: "#78716C", bg: "#F5F5F4",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="6" y="18" width="28" height="16" rx="2" fill="#78716C" opacity="0.2"/>
        <rect x="6" y="18" width="28" height="16" rx="2" stroke="#78716C" strokeWidth="1.5"/>
        <path d="M14 18V14a6 6 0 0 1 12 0v4" stroke="#78716C" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="26" r="3" fill="#78716C"/>
        <circle cx="20" cy="26" r="1.5" fill="#F5F5F4"/>
        <rect x="10" y="22" width="3" height="8" rx="1" fill="#A8A29E" opacity="0.5"/>
        <rect x="27" y="22" width="3" height="8" rx="1" fill="#A8A29E" opacity="0.5"/>
      </svg>
    ),
  },
  "wheels": {
    color: "#1F2937", bg: "#F9FAFB",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <circle cx="20" cy="20" r="14" stroke="#374151" strokeWidth="2"/>
        <circle cx="20" cy="20" r="6" fill="#374151" stroke="#6B7280" strokeWidth="1"/>
        <circle cx="20" cy="20" r="3" fill="#9CA3AF"/>
        {/* Spokes */}
        <line x1="20" y1="6" x2="20" y2="14" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="20" y1="26" x2="20" y2="34" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="14" y2="20" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="26" y1="20" x2="34" y2="20" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="9.5" y1="9.5" x2="15.4" y2="15.4" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="24.6" y1="24.6" x2="30.5" y2="30.5" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="30.5" y1="9.5" x2="24.6" y2="15.4" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
        <line x1="15.4" y1="24.6" x2="9.5" y2="30.5" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  "perfumes": {
    color: "#EC4899", bg: "#FCE7F3",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="14" y="16" width="12" height="18" rx="3" fill="#EC4899" opacity="0.3"/>
        <rect x="14" y="16" width="12" height="18" rx="3" stroke="#EC4899" strokeWidth="1.5"/>
        <rect x="17" y="12" width="6" height="5" rx="1" fill="#EC4899"/>
        <rect x="18.5" y="9" width="3" height="4" rx="1" fill="#F9A8D4"/>
        <path d="M22 7 Q24 5 22 3 Q20 5 22 7Z" fill="#EC4899"/>
        <path d="M26 25 Q30 23 29 20 Q27 22 26 25Z" stroke="#F9A8D4" strokeWidth="1" fill="none" opacity="0.7"/>
        <path d="M28 30 Q33 27 31 23" stroke="#F9A8D4" strokeWidth="1" fill="none" opacity="0.5"/>
        <path d="M24 22 Q27 20 26 17" stroke="#F9A8D4" strokeWidth="0.8" fill="none" opacity="0.6"/>
      </svg>
    ),
  },
  "car-mats": {
    color: "#059669", bg: "#D1FAE5",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="5" y="10" width="30" height="22" rx="3" fill="#059669" opacity="0.15" stroke="#059669" strokeWidth="1.5"/>
        <line x1="5" y1="16" x2="35" y2="16" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="5" y1="22" x2="35" y2="22" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="5" y1="28" x2="35" y2="28" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="11" y1="10" x2="11" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="17" y1="10" x2="17" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="23" y1="10" x2="23" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <line x1="29" y1="10" x2="29" y2="32" stroke="#059669" strokeWidth="0.8" opacity="0.5"/>
        <path d="M7 10 Q5 10 5 12" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 10 Q35 10 35 12" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 32 Q5 32 5 30" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 32 Q35 32 35 30" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  "music-stereo": {
    color: "#7C3AED", bg: "#EDE9FE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <circle cx="20" cy="20" r="13" fill="#7C3AED" opacity="0.15" stroke="#7C3AED" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="7" fill="#7C3AED" opacity="0.3"/>
        <circle cx="20" cy="20" r="3" fill="#7C3AED"/>
        <circle cx="20" cy="20" r="1.2" fill="#DDD6FE"/>
        <path d="M26 10 L28 6 L32 8 L30 12" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="26" y1="10" x2="30" y2="14" stroke="#7C3AED" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
  },
  "security": {
    color: "#DC2626", bg: "#FEE2E2",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1.5">
        <rect x="10" y="18" width="20" height="16" rx="2.5" fill="#DC2626" opacity="0.2"/>
        <rect x="10" y="18" width="20" height="16" rx="2.5" stroke="#DC2626" strokeWidth="1.5"/>
        <path d="M14 18V13a6 6 0 0 1 12 0v5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="26.5" r="3" fill="#DC2626"/>
        <rect x="19" y="27" width="2" height="4" rx="1" fill="#FCA5A5"/>
        <circle cx="28" cy="11" r="3" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1"/>
        <path d="M27 11l1 1 2-2" stroke="#DC2626" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  "bike-accessories": {
    color: "#0EA5E9", bg: "#E0F2FE",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <circle cx="10" cy="28" r="7" stroke="#0EA5E9" strokeWidth="1.8" fill="none"/>
        <circle cx="30" cy="28" r="7" stroke="#0EA5E9" strokeWidth="1.8" fill="none"/>
        <circle cx="10" cy="28" r="2" fill="#0EA5E9"/>
        <circle cx="30" cy="28" r="2" fill="#0EA5E9"/>
        <path d="M10 28 L20 14 L30 28" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M14 28 L20 14" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 14 L24 10 L28 12" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 14 L20 10" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 10 L22 10" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  "spare-parts": {
    color: "#64748B", bg: "#F1F5F9",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-full h-full p-1">
        <path d="M20 6a4 4 0 0 1 4 4c0 .55-.1 1.08-.3 1.57L30 18a4 4 0 1 1-1.41 1.41l-6.3-6.43A4 4 0 0 1 20 14a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z" fill="#64748B" opacity="0.3"/>
        <path d="M10 22a4 4 0 0 1 4 4c0 .55-.1 1.08-.3 1.57L20 34a4 4 0 1 1-1.41 1.41l-6.3-6.43A4 4 0 0 1 10 30a4 4 0 0 1-4-4 4 4 0 0 1 4-4Z" fill="#64748B" opacity="0.5"/>
        <circle cx="20" cy="10" r="2" fill="#64748B"/>
        <circle cx="30" cy="20" r="2" fill="#64748B"/>
        <circle cx="10" cy="26" r="2" fill="#64748B"/>
        <circle cx="20" cy="35" r="2" fill="#64748B"/>
        <line x1="20" y1="14" x2="20" y2="20" stroke="#94A3B8" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="4" fill="#64748B" stroke="#CBD5E1" strokeWidth="1"/>
        <circle cx="20" cy="20" r="1.5" fill="#F1F5F9"/>
      </svg>
    ),
  },
};

export function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-background w-full min-w-0 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
        <SectionHeader
          badge="Top Categories"
          title="Shop by Category"
          subtitle="Car top covers, floor matting, custom seat covers and more"
          viewAllHref="/products"
        />
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
          {categories.map((cat, i) => {
            const config = categoryConfig[cat.slug];
            const usePhoto = SIGNATURE_SLUG_SET.has(cat.slug) && cat.image;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-1.5 sm:gap-2.5 p-2 xs:p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center min-w-0"
              >
                {/* Icon Container */}
                <div
                  className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0 overflow-hidden shadow-sm relative"
                    style={{ backgroundColor: usePhoto ? undefined : (config?.bg ?? "#F3F4F6") }}
                  >
                    {usePhoto ? (
                      <Image
                        src={cat.image!}
                        alt={cat.name}
                        fill
                        className="object-cover object-center"
                        sizes="64px"
                      />
                    ) : config ? (
                      <div className="h-full w-full">
                        {config.icon}
                      </div>
                    ) : (
                      <span
                        className="text-lg font-black"
                        style={{ color: "#D50000" }}
                      >
                        {cat.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className="text-[10px] sm:text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight"
                  >
                    {cat.name}
                  </span>

                  {/* Count */}
                  <span className="text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: config ? config.bg : "#FEE2E2",
                      color: config ? config.color : "#D50000",
                    }}
                  >
                    {cat.productCount}+
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
