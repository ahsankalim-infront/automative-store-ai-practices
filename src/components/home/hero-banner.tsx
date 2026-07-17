"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { useBrand } from "@/lib/brand/brand-context";
import { mapHeroSlides, type HeroSlideView } from "@/lib/hero-slides/map-slide";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types";

function SlideDots({
  current,
  onSelect,
  accent,
  slides,
}: {
  current: number;
  onSelect: (index: number) => void;
  accent: string;
  slides: HeroSlideView[];
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      {slides.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className="p-1"
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              height: "4px",
              width: i === current ? "18px" : "4px",
              backgroundColor: i === current ? accent : "rgba(255,255,255,0.35)",
            }}
          />
        </button>
      ))}
    </div>
  );
}

const navBtnClass =
  "rounded-full bg-black/50 md:bg-white/10 hover:bg-black/65 md:hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all shrink-0";

export function HeroBanner({ slides: slideData }: { slides: HeroSlide[] }) {
  const brand = useBrand();
  const slides = useMemo(
    () => mapHeroSlides(slideData, brand.shortName),
    [slideData, brand.shortName]
  );
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);
  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    setAutoPlay(false);
  };

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [autoPlay, next, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];
  const BadgeIcon = slide.badge.icon;
  const isFirstSlide = current === 0;

  return (
    <section className="relative isolate overflow-hidden bg-black w-full min-w-0 h-[268px] xs:h-[284px] sm:h-[320px] md:h-auto md:min-h-[640px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0 flex flex-col md:flex-row w-full min-w-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className={cn(
              "relative flex-1 h-full min-h-0 flex flex-col",
              "px-3 xs:px-4 sm:px-6 md:px-10 lg:px-16",
              "pt-8 xs:pt-9 sm:pt-10 pb-[2.75rem] sm:pb-12 md:py-10",
              "overflow-hidden bg-gradient-to-br",
              slide.leftBg
            )}
          >
            <div className="absolute inset-0 md:hidden overflow-hidden">
              <Image
                src={slide.productImage}
                alt={slide.productLabel}
                fill
                className="object-cover object-[center_30%]"
                sizes="100vw"
                priority={isFirstSlide}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35" />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${slide.accent}30 0%, transparent 45%)` }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="relative z-10 mt-auto w-full max-w-lg min-w-0 md:mt-0 md:my-auto pr-8 sm:pr-10 md:pr-0"
            >
              <span
                className="inline-flex max-w-[calc(100%-2rem)] items-center text-[9px] xs:text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full mb-1.5 sm:mb-4 border truncate"
                style={{
                  backgroundColor: `${slide.accent}22`,
                  borderColor: `${slide.accent}44`,
                  color: slide.accentLight,
                }}
              >
                {slide.tag}
              </span>

              <h1 className="font-black text-white leading-tight tracking-tight">
                <span className="block md:hidden text-lg xs:text-xl sm:text-2xl line-clamp-2">
                  {slide.mobileTitle}
                </span>
                <span className="hidden md:block text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">
                  {slide.title.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </h1>

              <div className="flex items-center gap-1.5 mt-1 mb-2 sm:mb-4 min-w-0 max-w-full">
                <div className="h-0.5 w-4 sm:w-8 rounded-full shrink-0" style={{ backgroundColor: slide.accent }} />
                <span
                  className="text-[10px] xs:text-[11px] sm:text-base font-semibold truncate"
                  style={{ color: slide.accentLight }}
                >
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

              <Link
                href={slide.cta.href}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ backgroundColor: slide.accent }}
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="md:hidden">{slide.mobileCta}</span>
                <span className="hidden md:inline truncate">{slide.cta.label}</span>
              </Link>

              <Link
                href={slide.secondary.href}
                className="hidden sm:inline-flex items-center justify-center gap-2 ml-2 sm:ml-3 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-200 border border-white/15 hover:border-white/30 hover:text-white transition-all align-middle"
              >
                <span className="truncate">{slide.secondary.label}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Link>

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
                  priority={isFirstSlide}
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

      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-14 z-30 text-[9px] xs:text-[10px] sm:text-xs text-white/55 font-medium tabular-nums bg-black/40 md:bg-transparent px-1.5 py-0.5 rounded md:rounded-none">
        {String(current + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-0 inset-x-0 z-30 h-11 sm:h-12 md:hidden flex items-center justify-between px-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
            <button
              type="button"
              onClick={() => {
                prev();
                setAutoPlay(false);
              }}
              aria-label="Previous slide"
              className={cn(navBtnClass, "h-10 w-10 sm:h-7 sm:w-7")}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <SlideDots current={current} onSelect={goTo} accent={slide.accent} slides={slides} />
            <button
              type="button"
              onClick={() => {
                next();
                setAutoPlay(false);
              }}
              aria-label="Next slide"
              className={cn(navBtnClass, "h-10 w-10 sm:h-7 sm:w-7")}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

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
            <SlideDots current={current} onSelect={goTo} accent={slide.accent} slides={slides} />
          </div>
        </>
      )}
    </section>
  );
}
