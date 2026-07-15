"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, LayoutGrid, Umbrella } from "lucide-react";
import { SIGNATURE_IMAGES_PROMO } from "@/lib/brand/signature-images";

const promos = [
  {
    title: "Custom Seat Covers",
    subtitle: "Premium PU/PVC leather · All colours",
    cta: "Shop Now",
    href: "/products?category=custom-seat-covers",
    icon: Sparkles,
    image: SIGNATURE_IMAGES_PROMO.seatCovers,
    accent: "#D50000",
  },
  {
    title: "Car Floor Matting",
    subtitle: "Custom 5D · 7D · 9D fit for your car",
    cta: "Explore Mats",
    href: "/products?category=car-floor-matting",
    icon: LayoutGrid,
    image: SIGNATURE_IMAGES_PROMO.floorMatting,
    accent: "#059669",
  },
  {
    title: "Car Top Cover",
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
    <section className="relative -mt-10 sm:-mt-14 z-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promos.map((promo, i) => {
            const Icon = promo.icon;
            return (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <Link
                href={promo.href}
                className="group relative flex h-36 sm:h-44 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${promo.accent}ee 0%, ${promo.accent}99 50%, rgba(0,0,0,0.7) 100%)` }}
                />
                <div className="relative z-10 flex flex-col justify-between p-5 h-full w-full">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                    style={{ backgroundColor: `${promo.accent}44` }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-0.5">{promo.title}</h3>
                    <p className="text-white/75 text-xs mb-2.5">{promo.subtitle}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full group-hover:bg-white/25 transition-colors">
                      {promo.cta} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
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
