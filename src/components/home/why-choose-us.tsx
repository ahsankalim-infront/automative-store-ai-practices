"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Headphones, Award, Wrench } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "100% Genuine", desc: "Authorized distributors only", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: Truck, title: "Fast Delivery", desc: "1–3 days in major cities", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free policy", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: Wrench, title: "Expert Install", desc: "Certified technicians", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { icon: Award, title: "12+ Years", desc: "Trusted since 2012", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: Headphones, title: "24/7 Support", desc: "Call · WhatsApp · Chat", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
];

export function WhyChooseUs() {
  return (
    <section className="py-5 bg-card border-b border-border shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border/60">
          {features.map((f, i) => {
            const FeatureIcon = f.icon;
            return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center text-center p-4 sm:p-5 hover:bg-surface transition-colors group"
            >
              <div className={`h-11 w-11 rounded-2xl ${f.bg} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300`}>
                <FeatureIcon className={`h-5 w-5 ${f.color}`} />
              </div>
              <p className="text-xs font-bold text-foreground mb-0.5">{f.title}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{f.desc}</p>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
