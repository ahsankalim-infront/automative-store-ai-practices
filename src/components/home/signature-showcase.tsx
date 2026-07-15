"use client";

import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SIGNATURE_CATEGORIES } from "@/lib/brand/signature-categories";
import { BRAND } from "@/lib/brand/config";

export function SignatureShowcase() {
  const [featured, ...rest] = SIGNATURE_CATEGORIES;

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-background via-surface/40 to-background relative overflow-hidden w-full min-w-0">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
            <span className="h-px w-8 bg-primary/50" />
            Our Specialties
            <span className="h-px w-8 bg-primary/50" />
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            {BRAND.shortName} Signature Collection
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover our four most popular product lines — premium car poshish, seat covers,
            floor matting and top covers crafted with care in Lahore.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Featured — seat covers (large) */}
          <SignatureCard item={featured} className="lg:col-span-7 lg:row-span-2 min-h-[320px] lg:min-h-[480px]" large />

          {/* Top cover standard */}
          <SignatureCard item={rest[0]} className="lg:col-span-5 min-h-[240px]" />

          {/* Floor matting */}
          <SignatureCard item={rest[1]} className="lg:col-span-5 min-h-[240px]" />

          {/* Top cover premium — full width on mobile, spans bottom on lg */}
          <SignatureCard item={rest[2]} className="lg:col-span-12 min-h-[220px] lg:min-h-[200px]" horizontal />
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm"
        >
          <p className="text-sm text-gray-500 text-center sm:text-left">
            <span className="font-bold text-foreground">Need a custom quote?</span>{" "}
            Visit us at {BRAND.address.full} or call {BRAND.primaryPhone}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 transition-all shrink-0"
          >
            Get Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function SignatureCard({
  item,
  className = "",
  large = false,
  horizontal = false,
}: {
  item: (typeof SIGNATURE_CATEGORIES)[number];
  className?: string;
  large?: boolean;
  horizontal?: boolean;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={className}
    >
      <Link
        href={item.href}
        className={`group relative flex overflow-hidden rounded-2xl sm:rounded-3xl border border-border shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 h-full ${
          horizontal ? "flex-col sm:flex-row" : "flex-col"
        }`}
      >
        {/* Background image */}
        <div className={`relative overflow-hidden ${horizontal ? "sm:w-2/5 h-48 sm:h-auto" : large ? "h-52 sm:h-64 lg:h-auto lg:flex-1" : "h-44 sm:h-48"}`}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes={large ? "(max-width: 1024px) 100vw, 58vw" : horizontal ? "(max-width: 640px) 100vw, 40vw" : "(max-width: 1024px) 100vw, 42vw"}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${horizontal ? "to right" : "to top"}, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, ${item.accent}33 100%)`,
            }}
          />
          {/* Badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md border border-white/20 text-white"
            style={{ backgroundColor: `${item.accent}55` }}
          >
            <Icon className="h-3.5 w-3.5" />
            {item.badge}
          </div>
        </div>

        {/* Content */}
        <div
          className={`relative flex flex-col justify-between p-5 sm:p-6 bg-card ${
            horizontal ? "sm:flex-1" : ""
          } ${large ? "lg:p-8" : ""}`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: item.accent }}>
              {item.subtitle}
            </p>
            <h3
              className={`font-black text-foreground leading-tight mb-2 group-hover:text-primary transition-colors ${
                large ? "text-xl sm:text-2xl lg:text-3xl" : horizontal ? "text-lg sm:text-xl" : "text-lg sm:text-xl"
              }`}
            >
              {item.title}
            </h3>
            <p className={`text-gray-500 dark:text-gray-400 leading-relaxed ${large ? "text-sm sm:text-base" : "text-xs sm:text-sm line-clamp-2 lg:line-clamp-3"}`}>
              {item.description}
            </p>

            {/* Highlights */}
            <ul className={`mt-4 grid gap-2 ${large ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-2"}`}>
              {item.highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: item.accent }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <span
            className="inline-flex items-center gap-2 mt-5 w-fit px-4 py-2 rounded-xl text-sm font-bold text-white transition-all group-hover:gap-3"
            style={{ backgroundColor: item.accent }}
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
