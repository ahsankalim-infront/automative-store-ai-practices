"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import type { Brand } from "@/types";

export function ShopByBrand({ brands }: { brands: Brand[] }) {

  return (
    <section className="py-14 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Trusted Brands"
          title="Shop by Brand"
          subtitle="Genuine products from world-class automotive brands"
          viewAllHref="/products"
        />
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/products?brand=${brand.slug}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-10 w-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    sizes="80px"
                  />
                </div>
                <span className="text-[10px] font-semibold text-gray-500 group-hover:text-primary transition-colors truncate w-full text-center">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
