"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { Sparkles, LayoutGrid, Umbrella } from "lucide-react";
import { SIGNATURE_IMAGES_PROMO } from "@/lib/brand/signature-images";

const promos = [
  {
    title: "Custom Seat Covers",
    shortTitle: "Seat Covers",
    href: "/products?category=custom-seat-covers",
    icon: Sparkles,
    image: SIGNATURE_IMAGES_PROMO.seatCovers,
    accent: "#D50000",
  },
  {
    title: "Car Floor Matting",
    shortTitle: "Floor Mats",
    href: "/products?category=car-floor-matting",
    icon: LayoutGrid,
    image: SIGNATURE_IMAGES_PROMO.floorMatting,
    accent: "#059669",
  },
  {
    title: "Car Top Cover",
    shortTitle: "Top Cover",
    href: "/products?category=car-top-cover",
    icon: Umbrella,
    image: SIGNATURE_IMAGES_PROMO.topCover,
    accent: "#2563EB",
  },
];

export function PromoBanners() {
  return (
    <section className="relative z-10 w-full min-w-0 px-3 sm:px-4 pt-2 sm:pt-0 sm:-mt-8 md:-mt-14 pb-1 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.title}
                className="min-w-0"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
              >
                <Link
                  href={promo.href}
                  aria-label={promo.title}
                  className="group relative block w-full min-w-0 h-[5.25rem] xs:h-[5.75rem] sm:h-36 md:h-44 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-sm sm:shadow-md md:shadow-lg sm:hover:-translate-y-1 transition-all duration-300"
                >
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover object-center sm:group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 33vw, 320px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${promo.accent}55 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.82) 100%)`,
                    }}
                  />

                  <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1.5 p-1.5 xs:p-2 sm:items-start sm:justify-between sm:p-4 md:p-5 text-center sm:text-left">
                    <div
                      className="flex h-6 w-6 xs:h-7 xs:w-7 sm:h-9 sm:w-10 items-center justify-center rounded-md sm:rounded-lg border border-white/25 shrink-0"
                      style={{ backgroundColor: `${promo.accent}66` }}
                    >
                      <Icon className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-5 text-white" />
                    </div>

                    <div className="min-w-0 w-full">
                      <h3 className="text-white font-bold text-[9px] xs:text-[10px] sm:text-sm md:text-base leading-[1.15] line-clamp-2">
                        <span className="sm:hidden">{promo.shortTitle}</span>
                        <span className="hidden sm:inline">{promo.title}</span>
                      </h3>
                      <p className="hidden sm:block text-white/70 text-[11px] md:text-xs mt-1 line-clamp-1">
                        Tap to explore
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
