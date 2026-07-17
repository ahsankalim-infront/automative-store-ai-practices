"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { Package, ArrowRight, Percent } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPrice } from "@/lib/utils";
import { resolveBundleTag } from "@/lib/bundles/defaults";
import type { BundleOffer, BundleOffersSectionConfig } from "@/types";

interface BundleOffersProps {
  section: BundleOffersSectionConfig;
  offers: BundleOffer[];
}

export function BundleOffers({ section, offers }: BundleOffersProps) {
  if (!section.isEnabled || offers.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-gray-50 to-background dark:from-gray-900/50 dark:to-background w-full min-w-0 overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
        <SectionHeader
          badge={section.badge}
          title={section.title}
          subtitle={section.subtitle}
          viewAllHref={section.viewAllHref}
        />
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {offers.map((bundle, i) => {
            const tag = resolveBundleTag(bundle);
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="min-w-0 h-full"
              >
                <Link
                  href={bundle.href}
                  className="group flex flex-col h-full bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 min-w-0"
                >
                  <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden shrink-0">
                    <Image
                      src={bundle.image}
                      alt={bundle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-primary text-white text-[9px] sm:text-[10px] font-bold max-w-[85%] truncate">
                      <Percent className="h-3 w-3 shrink-0" /> {tag}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-3.5 sm:p-5 min-w-0">
                    <div className="flex items-start gap-2 mb-1.5 sm:mb-2 min-w-0">
                      <Package className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <h3 className="font-bold text-foreground text-xs sm:text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {bundle.title}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-500 mb-3 sm:mb-4 flex-1 line-clamp-2 sm:line-clamp-3">
                      {bundle.description}
                    </p>
                    <div className="flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-border mt-auto min-w-0">
                      <div className="min-w-0">
                        <span className="text-base sm:text-lg font-black text-primary">{formatPrice(bundle.price)}</span>
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through ml-1.5 sm:ml-2">
                          {formatPrice(bundle.originalPrice)}
                        </span>
                      </div>
                      <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-bold text-primary shrink-0 group-hover:gap-1.5 sm:group-hover:gap-2 transition-all">
                        View <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
