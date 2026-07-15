"use client";
import Link from "next/link";
import { Shield, Clock, MapPin, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices, useStores } from "@/hooks/use-api-data";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/brand/config";

export default function ServicesPage() {
  const { data: services = [] } = useServices();
  const { data: stores = [] } = useStores();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #D50000, transparent 50%)" }} />
        <div className="relative max-w-screen-xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            <Shield className="h-4 w-4" /> Professional Services
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Car Care Services</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base mb-8">
            Professional PPF, detailing, ceramic coating, window tinting, and installation services. 18+ branches across Pakistan.
          </p>
          <Button asChild size="xl">
            <Link href="/services/book">Book a Service Today</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} id={service.slug}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <Shield className="h-16 w-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                  {service.popular && (
                    <span className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">Popular</span>
                  )}
                  <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
                    <p className="text-white text-xs font-semibold">{service.duration}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {service.features.slice(0, 3).map(feat => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" /> {feat}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="text-xl font-black text-primary">{formatPrice(service.priceFrom)}</p>
                    </div>
                    <Button asChild size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      <Link href="/services/book">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-black text-foreground text-center mb-10">Why Choose {BRAND.name} Services?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "18+", label: "Dustfree Studios" },
              { value: "10 Yr", label: "PPF Warranty" },
              { value: "Expert", label: "Certified Technicians" },
              { value: "4.8★", label: "Service Rating" },
            ].map(stat => (
              <div key={stat.label} className="bg-card rounded-2xl p-6 border border-border">
                <p className="text-3xl font-black text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
