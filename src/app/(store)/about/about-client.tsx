"use client";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Users, Package, Star, Truck,
  ShieldCheck, Zap, ArrowRight, CheckCircle, Target,
  Heart, Award, Clock, TrendingUp,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay } from "@/lib/brand/config";
import type { AboutPageContent } from "@/types";

const stats = [
  { icon: Package,   value: "500+",    label: "Poshish Designs",     color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30" },
  { icon: Users,     value: "5,000+",  label: "Happy Customers",     color: "bg-green-50 text-green-600 dark:bg-green-900/30" },
  { icon: MapPin,    value: "1",       label: "Lahore Showroom",     color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30" },
  { icon: Star,      value: "4.9★",    label: "Customer Rating",     color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30" },
  { icon: Truck,     value: "PK Wide", label: "Delivery Available",  color: "bg-primary/10 text-primary" },
  { icon: Award,     value: "10+",     label: "Years Experience",    color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30" },
];

const values = [
  {
    icon: ShieldCheck, title: "100% Genuine Products",
    desc: "We source directly from authorized distributors and manufacturers. Every product on our platform is authentic, tested, and guaranteed genuine.",
    color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Heart, title: "Customer First",
    desc: "Our policies are built around you — hassle-free returns, responsive support, and a seamless shopping experience from browse to delivery.",
    color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20",
  },
  {
    icon: Zap, title: "Innovation & Quality",
    desc: "We continuously update our catalog with the latest automotive technology and accessories. Quality is never compromised.",
    color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: Target, title: "Vehicle-First Approach",
    desc: "Every product is categorized and verified for vehicle compatibility. Find exactly what fits your car — not just what fits a shelf.",
    color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    icon: TrendingUp, title: "Competitive Pricing",
    desc: "We leverage our buying power and direct relationships with brands to pass maximum savings on to our customers.",
    color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Clock, title: "Nationwide Reach",
    desc: "With our Lahore office on Abbot Road and delivery across Pakistan, we bring premium poshish and seat covers to customers nationwide.",
    color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
];

const branches = [
  { city: "Lahore", branches: 1, flagship: true },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage({ content }: { content: AboutPageContent }) {
  const brand = useBrand();
  const { journeySection, leadershipSection, team, milestones } = content;
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-[#1a0000] to-secondary">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1600&h=700&q=80"
            alt={brand.name}
            fill
            className="object-cover opacity-10"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 pt-8 pb-20">
          <Breadcrumb items={[{ label: "About Us" }]} className="mb-8 [&_*]:text-gray-400 [&_a:hover]:text-white" />
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold mb-5"
            >
              <Award className="h-3.5 w-3.5" /> Premium Car Poshish · Lahore
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              Lahore&apos;s Trusted<br />
              <span className="text-primary">Poshish House</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
            >
              {brand.name} specializes in premium car poshish, custom seat covers, and interior upholstery.
              Visit us at Moeen Center, Abbot Road — or shop online with delivery across Pakistan.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="lg" asChild>
                <Link href="/products">Shop Now <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button size="lg" variant="outline"
                className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/store-locator">Find a Branch</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex flex-col items-center justify-center py-5 px-3 text-center"
                >
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-5 leading-tight">
                Started in a single shop.<br />Now serving a nation.
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                <p>
                  {brand.name} started as a dedicated car poshish workshop in Lahore. Founder Shahzad Ahmed built the business on quality materials, expert fitting, and honest customer service.
                </p>
                <p>
                  From custom seat covers to full interior poshish, we help customers choose the right fabrics, colors, and designs for their vehicles — with professional fitting at our Abbot Road office.
                </p>
                <p>
                  Today we serve customers across Lahore and Pakistan through our showroom at <strong>Moeen Center</strong>, online ordering, and nationwide delivery on seat covers and accessories.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Abbot Road Lahore", "Custom Poshish", "Seat Covers", "Expert Fitting"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-xs font-semibold text-primary">
                    <CheckCircle className="h-3.5 w-3.5" /> {t}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* Image grid */}
            <FadeIn delay={0.15} className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=400&h=300&q=80" alt={`${brand.name} showroom`} fill className="object-cover" sizes="200px" />
                </div>
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=400&h=250&q=80" alt="Car detailing" fill className="object-cover" sizes="200px" />
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="relative h-32 rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=400&h=250&q=80" alt="PPF service" fill className="object-cover" sizes="200px" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&h=300&q=80" alt="Car accessories" fill className="object-cover" sizes="200px" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-screen-xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Everything we do is guided by a commitment to quality, authenticity, and customer satisfaction.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => {
              const ValueIcon = v.icon;
              return (
              <FadeIn key={v.title} delay={i * 0.07}>
                <div className="group bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`h-11 w-11 rounded-xl ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <ValueIcon className={`h-5 w-5 ${v.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      {journeySection.isEnabled && milestones.length > 0 && (
      <section className="py-16 sm:py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #D50000 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-screen-xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">{journeySection.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{journeySection.title}</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">{journeySection.subtitle}</p>
          </FadeIn>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <FadeIn key={m.id} delay={i * 0.1}>
                  <div className={`flex gap-6 md:gap-0 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors ${i % 2 === 0 ? "md:ml-auto" : ""} max-w-md`}>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-black mb-2">{m.year}</span>
                        <h3 className="font-bold text-white mb-1.5">{m.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{m.description}</p>
                      </div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex items-center justify-center shrink-0 z-10">
                      <div className="h-4 w-4 rounded-full bg-primary border-2 border-secondary shadow-lg shadow-primary/30" />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── TEAM ── */}
      {leadershipSection.isEnabled && team.length > 0 && (
      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-screen-xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">{leadershipSection.eyebrow}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">{leadershipSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              {leadershipSection.subtitle}
            </p>
          </FadeIn>
          <div className={`grid gap-5 sm:gap-6 ${
            team.length === 1
              ? "grid-cols-1 max-w-xs mx-auto"
              : team.length === 2
                ? "grid-cols-2 max-w-lg mx-auto"
                : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
          }`}>
            {team.map((member, i) => (
              <FadeIn key={member.id} delay={i * 0.08}>
                <div className="group text-center">
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 mx-auto mb-4 rounded-2xl overflow-hidden border-4 border-border group-hover:border-primary/40 transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="144px"
                    />
                  </div>
                  <h3 className="font-bold text-foreground text-sm sm:text-base">{member.name}</h3>
                  <p className="text-primary text-xs sm:text-sm font-semibold mt-0.5">{member.role}</p>
                  <p className="text-gray-400 text-xs mt-1">{member.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── BRANCHES MAP ── */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-screen-xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-widest mb-3">Nationwide</span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">Find Us Across Pakistan</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              Walk into any of our 18+ branches for in-store shopping, professional installation, and expert advice.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
            {branches.map((b, i) => (
              <FadeIn key={b.city} delay={i * 0.05}>
                <Link href="/store-locator"
                  className="group flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all text-center">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${b.flagship ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{b.city}</p>
                    <p className="text-[10px] text-gray-400">{b.branches} {b.branches === 1 ? "Branch" : "Branches"}</p>
                  </div>
                  {b.flagship && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">HQ</span>
                  )}
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/store-locator">
                <MapPin className="h-4 w-4 mr-2" /> View All Branches & Hours
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-dark to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-screen-xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Upgrade Your Ride?</h2>
            <p className="text-white/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Explore 10,000+ premium products, book a service, or visit a branch near you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold" asChild>
                <Link href="/products"><Package className="h-4 w-4 mr-2" /> Shop Products</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/services"><Zap className="h-4 w-4 mr-2" /> Book a Service</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/contact"><Phone className="h-4 w-4 mr-2" /> Contact Us</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/60 text-xs">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {formatPhoneDisplay(brand.primaryPhone)}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {brand.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Abbot Road, Lahore</span>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
