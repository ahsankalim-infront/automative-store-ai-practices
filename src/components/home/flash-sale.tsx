"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Timer, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0 });
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative bg-white/10 backdrop-blur-sm border border-white/15 text-white font-black text-xl sm:text-2xl min-w-12 sm:min-w-14 text-center rounded-xl px-2 sm:px-3 py-2 sm:py-2.5 tabular-nums shadow-lg">
      {String(value).padStart(2, "0")}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
    </div>
    <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1.5 font-medium">{label}</span>
  </div>
);

export function FlashSale({ saleProducts }: { saleProducts: Product[] }) {
  const endTime = saleProducts[0]?.flashSaleEnds;
  const { h, m, s } = useCountdown(endTime ?? "");

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-[#1a0505] to-[#0f0f0f]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 blur-[80px] rounded-full" />

      <div className="relative max-w-screen-xl mx-auto px-4">
        {/* Header card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Live Now
                </span>
                <Timer className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Flash Sale</h2>
              <p className="text-gray-400 text-sm mt-1">Exclusive deals — hurry before they&apos;re gone!</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs text-gray-500 hidden sm:block uppercase tracking-wider">Ends in</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <TimeBox value={h} label="Hours" />
              <span className="text-primary text-xl font-black mb-5">:</span>
              <TimeBox value={m} label="Mins" />
              <span className="text-primary text-xl font-black mb-5">:</span>
              <TimeBox value={s} label="Secs" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {saleProducts.map((product, i) => (
            <motion.div
              key={product.id}
              className="h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            <Link href="/products?sale=true">View All Sale Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
