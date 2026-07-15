"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { Shield, Sparkles, Check, ArrowRight, Star, MapPin, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";

const services = [
  {
    icon: Shield,
    title: "Paint Protection Film",
    desc: "Self-healing TPU PPF for ultimate paint protection against stone chips, UV, and scratches.",
    price: "Rs. 25,000",
    href: "/services/book",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&h=600&q=85",
    accent: "#3B82F6",
    accentBg: "bg-blue-500/20",
    gradient: "from-blue-950/95 via-blue-900/70 to-transparent",
    features: ["Self-Healing TPU", "UV Resistant", "10 Year Warranty", "Dustfree Studio"],
    rating: "4.9",
    tag: "Most Popular",
  },
  {
    icon: Sparkles,
    title: "Car Detailing & Ceramic",
    desc: "Professional ceramic coating and full detailing for a permanent mirror gloss finish.",
    price: "Rs. 18,000",
    href: "/services/book",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&h=600&q=85",
    accent: "#F59E0B",
    accentBg: "bg-amber-500/20",
    gradient: "from-amber-950/95 via-amber-900/70 to-transparent",
    features: ["9H Ceramic Coating", "Paint Correction", "Interior Deep Clean", "Hydrophobic Effect"],
    rating: "4.8",
    tag: "Premium",
  },
];

const highlights = [
  { icon: Award, label: "Certified Technicians" },
  { icon: MapPin, label: "5 Studio Locations" },
  { icon: Star, label: "50,000+ Happy Clients" },
];

export function PPFServicesBanner() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-secondary to-[#0a0a0a]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #D50000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Premium Services"
          title="Protect & Detail Your Vehicle"
          subtitle="Trusted by 50,000+ car owners across Pakistan. Certified technicians at dedicated dustfree studios."
          viewAllHref="/services"
          viewAllLabel="All Services"
          centered
          className="text-center [&_h2]:text-white [&_p]:text-gray-400 mb-10 sm:mb-12"
        />

        {/* Highlight pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {highlights.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group"
              >
                <div className="relative h-[420px] sm:h-[460px] rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1">
                  {/* Image */}
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Overlays */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${svc.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between z-10">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border"
                      style={{ backgroundColor: `${svc.accent}33`, borderColor: `${svc.accent}55` }}
                    >
                      {svc.tag}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {svc.rating}
                    </span>
                  </div>

                  {/* Content — bottom glass panel */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                    <div className="rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-5 sm:p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`h-12 w-12 rounded-xl ${svc.accentBg} backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10`}
                        >
                          <Icon className="h-5 w-5" style={{ color: svc.accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">{svc.title}</h3>
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">{svc.desc}</p>
                        </div>
                      </div>

                      {/* Features grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
                        {svc.features.map(f => (
                          <div key={f} className="flex items-center gap-2 text-xs text-gray-200">
                            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Starting from</p>
                          <p className="text-xl sm:text-2xl font-black text-white">
                            {svc.price}
                          </p>
                        </div>
                        <Button
                          size="md"
                          className="shadow-lg shadow-primary/25 shrink-0"
                          rightIcon={<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
                          asChild
                        >
                          <Link href={svc.href}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold text-sm">Not sure which service you need?</p>
            <p className="text-gray-400 text-xs mt-0.5">Get a free consultation at any of our 5 studios nationwide.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/services">Learn More</Link>
            </Button>
            <Button asChild>
              <Link href="/services/book">Free Consultation</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
