"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LayoutGrid, Umbrella } from "lucide-react";
import { SIGNATURE_IMAGES_PROMO } from "@/lib/brand/signature-images";

const promos = [
  {
    title: "Custom Seat Covers",
    shortTitle: "Seat Covers",
    subtitle: "Premium PU/PVC leather · All colours",
    cta: "Shop Now",
    href: "/products?category=custom-seat-covers",
    icon: Sparkles,
    image: SIGNATURE_IMAGES_PROMO.seatCovers,
    accent: "#D50000",
  },
  {
    title: "Car Floor Matting",
    shortTitle: "Floor Matting",
    subtitle: "Custom 5D · 7D · 9D fit for your car",
    cta: "Explore Mats",
    href: "/products?category=car-floor-matting",
    icon: LayoutGrid,
    image: SIGNATURE_IMAGES_PROMO.floorMatting,
    accent: "#059669",
  },
  {
    title: "Car Top Cover",
    shortTitle: "Top Cover",
    subtitle: "All-weather sun, dust & rain protection",
    cta: "View Covers",
    href: "/products?category=car-top-cover",
    icon: Umbrella,
    image: SIGNATURE_IMAGES_PROMO.topCover,
    accent: "#2563EB",
  },
];

export function PromoBanners() {
  return (
    <section className="relative z-20 px-3 sm:px-4 w-full min-w-0 -mt-4 sm:-mt-8 md:-mt-14 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.title}
                className="min-w-0"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <Link
                  href={promo.href}
                  className="group relative flex h-[6.75rem] xs:h-[7.25rem] sm:h-40 md:h-44 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-md sm:shadow-lg md:shadow-xl hover:shadow-2xl sm:hover:-translate-y-1.5 transition-all duration-300 w-full min-w-0"
                >
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 33vw, 320px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(160deg, ${promo.accent}ee 0%, ${promo.accent}aa 45%, rgba(0,0,0,0.75) 100%)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col justify-between p-2 xs:p-2.5 sm:p-4 md:p-5 h-full w-full min-w-0">
                    <div
                      className="h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0"
                      style={{ backgroundColor: `${promo.accent}44` }}
                    >
                      <Icon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-[10px] xs:text-[11px] sm:text-sm md:text-base leading-tight mb-0.5 line-clamp-2 sm:line-clamp-none">
                        <span className="sm:hidden">{promo.shortTitle}</span>
                        <span className="hidden sm:inline">{promo.title}</span>
                      </h3>
                      <p className="hidden sm:block text-white/75 text-xs mb-2 sm:mb-2.5 line-clamp-2">
                        {promo.subtitle}
                      </p>
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] xs:text-[10px] sm:text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-3 sm:py-1.5 rounded-full group-hover:bg-white/25 transition-colors max-w-full">
                        <span className="truncate sm:hidden">Shop</span>
                        <span className="hidden sm:inline truncate">{promo.cta}</span>
                        <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </span>
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
