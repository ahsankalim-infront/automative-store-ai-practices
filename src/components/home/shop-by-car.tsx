"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import type { VehicleMake } from "@/types";

const brandColors: Record<string, string> = {
  toyota: "from-red-600 to-red-800",
  honda: "from-blue-600 to-blue-800",
  suzuki: "from-sky-500 to-blue-700",
  hyundai: "from-slate-600 to-slate-800",
  kia: "from-gray-700 to-gray-900",
  mg: "from-red-500 to-rose-700",
  changan: "from-indigo-600 to-indigo-800",
  bmw: "from-zinc-700 to-black",
};

export function ShopByCar({ vehicleMakes }: { vehicleMakes: VehicleMake[] }) {
  const popularMakes = vehicleMakes.slice(0, 8);

  return (
    <section className="py-14 bg-background">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Vehicle Fit"
          title="Shop by Car Brand"
          subtitle="Browse accessories compatible with your vehicle make"
          viewAllHref="/products"
        />
        <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {popularMakes.map((make, i) => (
            <motion.div
              key={make.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/products?make=${make.slug}`}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${brandColors[make.slug] ?? "from-gray-600 to-gray-800"} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <Car className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{make.name}</p>
                  <p className="text-[10px] text-gray-400">{make.models.length} models</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
