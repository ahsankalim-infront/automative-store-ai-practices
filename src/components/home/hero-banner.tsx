"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight, Star, Sparkles, LayoutGrid, Umbrella } from "lucide-react";
import { BRAND } from "@/lib/brand/config";
import { SIGNATURE_IMAGES_HERO } from "@/lib/brand/signature-images";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    tag: "★ #1 Best Seller",
    title: "Custom Made\nSeat Covers",
    highlight: "Premium PU/PVC · All Colours",
    description: "Top premium quality leather PU & PVC fabric seat covers. Custom fit for 200+ models with diamond stitching and expert fitting at our Lahore studio.",
    cta: { label: "Shop Seat Covers", href: "/products?category=custom-seat-covers" },
    secondary: { label: "Get Free Quote", href: "/contact" },
    productImage: SIGNATURE_IMAGES_HERO.seatCovers,
    productLabel: "Custom PU/PVC Leather",
    productPrice: "From Rs. 12,000",
    badge: { icon: Star, text: "Most Popular" },
    stats: [
      { value: "200+", label: "Car Models" },
      { value: "All", label: "Colours" },
      { value: "1 Yr", label: "Warranty" },
    ],
    leftBg: "from-[#0d0d0d] via-[#1a0a00] to-[#0d0d0d]",
    rightBg: "from-[#f5f0eb] to-[#ede8e0]",
    accent: "#D50000",
    accentLight: "#ff5252",
  },
  {
    id: 2,
    tag: "🛡️ All Weather Protection",
    title: "Car Top\nCover",
    highlight: "Sun · Dust · Rain Shield",
    description: "Heavy-duty waterproof car top covers with UV-resistant coating. Universal and premium fitted options to protect your vehicle outdoors.",
    cta: { label: "Shop Top Covers", href: "/products?category=car-top-cover" },
    secondary: { label: "View Collection", href: "/products?category=car-top-cover" },
    productImage: SIGNATURE_IMAGES_HERO.topCover,
    productLabel: "Waterproof Top Cover",
    productPrice: "From Rs. 6,500",
    badge: { icon: Umbrella, text: "UV Protected" },
    stats: [
      { value: "100%", label: "Waterproof" },
      { value: "UV", label: "Resistant" },
      { value: "6 Mo", label: "Warranty" },
    ],
    leftBg: "from-[#0d0d18] via-[#060618] to-[#0d0d18]",
    rightBg: "from-[#e8eaf6] to-[#dde0f5]",
    accent: "#2563EB",
    accentLight: "#93C5FD",
  },
  {
    id: 3,
    tag: "✨ Custom Fit Mats",
    title: "Car Floor\nMatting",
    highlight: "5D · 7D · 9D Sets",
    description: "Precision-cut floor matting for every car model. High-wall design traps dirt and spills. Odourless, waterproof and easy to clean.",
    cta: { label: "Shop Floor Matting", href: "/products?category=car-floor-matting" },
    secondary: { label: "Book Fitting", href: "/services/book" },
    productImage: SIGNATURE_IMAGES_HERO.floorMatting,
    productLabel: "Custom 7D Mat Set",
    productPrice: "From Rs. 8,500",
    badge: { icon: LayoutGrid, text: "Custom Fit" },
    stats: [
      { value: "5D/7D", label: "Options" },
      { value: "Anti", label: "Slip Base" },
      { value: "Easy", label: "Clean" },
    ],
    leftBg: "from-[#0d1a0d] via-[#061006] to-[#0d1a0d]",
    rightBg: "from-[#e8f5e9] to-[#dcedc8]",
    accent: "#059669",
    accentLight: "#6EE7B7",
  },
  {
    id: 4,
    tag: `🏆 ${BRAND.shortName} Specialties`,
    title: "Premium\nTop Cover",
    highlight: "Paint-Safe · Fitted",
    description: "Premium fitted car top covers with soft inner lining, mirror pockets and double-stitched seams. Complete protection without scratching your paint.",
    cta: { label: "Shop Premium Line", href: "/products?category=car-top-cover" },
    secondary: { label: "About Us", href: "/about" },
    productImage: SIGNATURE_IMAGES_HERO.topCoverPremium,
    productLabel: "Premium Fitted Cover",
    productPrice: "From Rs. 9,500",
    badge: { icon: Sparkles, text: "Premium Line" },
    stats: [
      { value: "Soft", label: "Lining" },
      { value: "Mirror", label: "Pockets" },
      { value: "1 Yr", label: "Warranty" },
    ],
    leftBg: "from-[#120d18] via-[#0a0610] to-[#120d18]",
    rightBg: "from-[#f3e8ff] to-[#e9d5ff]",
    accent: "#7C3AED",
    accentLight: "#C4B5FD",
  },
];

function SlideDots({
  current,
  onSelect,
  accent,
}: {
  current: number;
  onSelect: (index: number) => void;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {slides.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className="transition-all duration-300 rounded-full p-1"
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              height: "5px",
              width: i === current ? "20px" : "5px",
              backgroundColor: i === current ? accent : "rgba(255,255,255,0.35)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

const navBtnClass =
  "rounded-full bg-black/45 md:bg-white/10 hover:bg-black/60 md:hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white transition-all shrink-0";

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  const goTo = (index: number) => {
    setCurrent(index);
    setAutoPlay(false);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [autoPlay, next]);

  const slide = slides[current];
  const BadgeIcon = slide.badge.icon;

  return (
    <section className="relative overflow-hidden bg-black w-full min-w-0 max-md:h-[292px] sm:max-md:h-[320px] md:min-h-[640px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 flex flex-col md:flex-row w-full min-w-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div
            className={cn(
              "relative flex-1 h-full flex flex-col justify-end md:justify-center",
              "px-3.5 sm:px-6 md:px-10 lg:px-16 pt-9 sm:pt-10 pb-11 sm:pb-12 md:py-10",
              "overflow-hidden bg-gradient-to-br",
              slide.leftBg
            )}
          >
            {/* Mobile background */}
            <div className="absolute inset-0 md:hidden overflow-hidden">
              <Image
                src={slide.productImage}
                alt={slide.productLabel}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/72 to-black/40" />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${slide.accent}35 0%, transparent 50%)` }}
              />
            </div>

            <div
              className="absolute inset-0 opacity-[0.03] hidden md:block"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              }}
            />

            <div
              className="absolute -left-24 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-20 blur-3xl hidden md:block"
              style={{ backgroundColor: slide.accent }}
            />

            <motion.div
              key={`text-${slide.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 w-full max-w-lg min-w-0 pr-10 sm:pr-12 md:pr-0"
            >
              <span
                className="inline-flex items-center max-w-full text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full mb-1.5 sm:mb-4 border truncate"
                style={{
                  backgroundColor: `${slide.accent}22`,
                  borderColor: `${slide.accent}44`,
                  color: slide.accentLight,
                }}
              >
                {slide.tag}
              </span>

              <h1 className="font-black text-white text-[1.375rem] xs:text-2xl sm:text-4xl md:text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] tracking-tight">
                {slide.title.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <div className="flex items-center gap-2 mt-1 mb-2 sm:mb-4 min-w-0">
                <div className="h-0.5 w-5 sm:w-8 rounded-full shrink-0" style={{ backgroundColor: slide.accent }} />
                <span className="text-[11px] sm:text-base font-semibold truncate" style={{ color: slide.accentLight }}>
                  {slide.highlight}
                </span>
              </div>

              <p className="hidden sm:block text-gray-300/90 text-sm md:text-base leading-relaxed mb-4 sm:mb-6 max-w-sm">
                {slide.description}
              </p>

              <div className="hidden sm:grid sm:grid-cols-3 md:flex md:items-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-7">
                {slide.stats.map((s) => (
                  <div key={s.label} className="text-center sm:text-left rounded-lg bg-white/5 sm:bg-transparent px-2 py-1.5 sm:p-0">
                    <div className="text-base sm:text-lg md:text-xl font-black text-white leading-none">{s.value}</div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] max-w-full"
                  style={{ backgroundColor: slide.accent }}
                >
                  <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{slide.cta.label}</span>
                </Link>
                <Link
                  href={slide.secondary.href}
                  className="hidden sm:inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-200 border border-white/15 hover:border-white/30 hover:text-white transition-all"
                >
                  <span className="truncate">{slide.secondary.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </div>

              <div className="hidden sm:flex md:hidden items-center gap-2.5 mt-4 px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 w-full max-w-sm">
                <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-white/10">
                  <Image src={slide.productImage} alt={slide.productLabel} fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-white/60 truncate">{slide.productLabel}</p>
                  <p className="text-sm font-black text-white leading-tight">{slide.productPrice}</p>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shrink-0 max-w-[38%]"
                  style={{ backgroundColor: `${slide.accent}33`, color: slide.accentLight }}
                >
                  <BadgeIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{slide.badge.text}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div
            className={cn(
              "relative hidden md:flex md:w-[42%] lg:w-[45%] items-center justify-center bg-gradient-to-br overflow-hidden",
              slide.rightBg
            )}
          >
            <div className="absolute inset-0">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full opacity-30 blur-2xl"
                style={{ backgroundColor: slide.accent }}
              />
            </div>

            <motion.div
              key={`img-${slide.id}`}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative z-10 w-[78%] max-w-xs"
              style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18))" }}
            >
              <div className="relative aspect-square">
                <Image
                  src={slide.productImage}
                  alt={slide.productLabel}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="(max-width: 1024px) 40vw, 320px"
                  priority={slide.id === 1}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium truncate">{slide.productLabel}</p>
                  <p className="text-sm font-black text-secondary leading-tight">{slide.productPrice}</p>
                </div>
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: `${slide.accent}15`, color: slide.accent }}
                >
                  <BadgeIcon className="h-3 w-3" />
                  {slide.badge.text}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide counter */}
      <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 md:top-4 md:right-14 z-30 text-[10px] sm:text-xs text-white/60 font-medium tabular-nums bg-black/35 md:bg-transparent px-2 py-0.5 rounded-full md:rounded-none">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Mobile controls — single bottom bar, no overlap */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex items-center justify-between gap-2 px-2.5 py-2 md:hidden bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <button
          type="button"
          onClick={() => {
            prev();
            setAutoPlay(false);
          }}
          aria-label="Previous slide"
          className={cn(navBtnClass, "h-7 w-7 pointer-events-auto")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="pointer-events-auto">
          <SlideDots current={current} onSelect={goTo} accent={slide.accent} />
        </div>
        <button
          type="button"
          onClick={() => {
            next();
            setAutoPlay(false);
          }}
          aria-label="Next slide"
          className={cn(navBtnClass, "h-7 w-7 pointer-events-auto")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop controls */}
      <button
        type="button"
        onClick={() => {
          prev();
          setAutoPlay(false);
        }}
        aria-label="Previous slide"
        className={cn(navBtnClass, "absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 hidden md:flex")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => {
          next();
          setAutoPlay(false);
        }}
        aria-label="Next slide"
        className={cn(navBtnClass, "absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 hidden md:flex")}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex">
        <SlideDots current={current} onSelect={goTo} accent={slide.accent} />
      </div>
    </section>
  );
}
