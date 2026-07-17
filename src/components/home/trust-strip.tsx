"use client";
import { Truck, RefreshCw, ShieldCheck, CreditCard, PhoneCall, BadgeCheck } from "lucide-react";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay } from "@/lib/brand/config";

export function TrustStrip() {
  const brand = useBrand();
  const items = [
  { icon: Truck,       label: "Free Delivery",       sub: "Orders above Rs. 1,500" },
  { icon: ShieldCheck, label: "Premium Quality",      sub: "Fine poshish materials" },
  { icon: RefreshCw,   label: "7-Day Easy Returns",   sub: "Hassle-free return policy" },
  { icon: CreditCard,  label: "Cash on Delivery",     sub: "Pay when you receive" },
  { icon: BadgeCheck,  label: "Expert Fitting",       sub: "At our Lahore office" },
  { icon: PhoneCall,   label: "Call & WhatsApp",      sub: `Call ${formatPhoneDisplay(brand.primaryPhone)}` },
];
  return (
    <div className="bg-white dark:bg-gray-950 border-b border-border shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-border">
          {items.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/5 transition-colors group">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4.5 w-4.5 text-primary" style={{ width: "18px", height: "18px" }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground leading-tight truncate">{label}</p>
                <p className="text-[10px] text-gray-400 leading-tight truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
