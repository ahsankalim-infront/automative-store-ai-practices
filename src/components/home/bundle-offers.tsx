"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { Package, ArrowRight, Percent } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPrice } from "@/lib/utils";

const bundles = [
  {
    title: "LED + Installation Bundle",
    desc: "H4 LED headlights with free professional installation at any branch",
    price: 16500,
    originalPrice: 19500,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&h=300&q=80",
    href: "/products?category=led-lighting",
    tag: "Save 15%",
  },
  {
    title: "Interior Upgrade Pack",
    desc: "Seat covers + floor mats + steering cover — complete interior refresh",
    price: 22000,
    originalPrice: 28000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&h=300&q=80",
    href: "/products?category=interior",
    tag: "Best Value",
  },
  {
    title: "Car Care Starter Kit",
    desc: "Shampoo, wax, microfiber cloths & glass cleaner — everything you need",
    price: 3500,
    originalPrice: 4800,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=500&h=300&q=80",
    href: "/products?category=car-care",
    tag: "Popular",
  },
];

export function BundleOffers() {
  return (
    <section className="py-14 bg-gradient-to-b from-gray-50 to-background dark:from-gray-900/50 dark:to-background">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Save More"
          title="Bundle Offers"
          subtitle="Curated product bundles with exclusive savings"
          viewAllHref="/products?bundle=true"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={bundle.href}
                className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={bundle.image}
                    alt={bundle.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold">
                    <Percent className="h-3 w-3" /> {bundle.tag}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <div className="flex items-start gap-2 mb-2">
                    <Package className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                      {bundle.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 flex-1">{bundle.desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <span className="text-lg font-black text-primary">{formatPrice(bundle.price)}</span>
                      <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(bundle.originalPrice)}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
