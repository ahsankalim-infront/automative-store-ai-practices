"use client";

import { useState } from "react";
import { X, Truck, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref, whatsappHref } from "@/lib/brand/config";

function AnnouncementContent() {
  const brand = useBrand();

  return (
    <>
      <span className="inline-flex items-center gap-2 text-xs whitespace-nowrap">
        <LogoMark size="sm" className="opacity-95" />
        <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
        <span>
          <strong>{brand.name}</strong> · {brand.announcementText}
        </span>
      </span>
      <span className="text-gray-600 text-xs hidden sm:inline" aria-hidden>
        |
      </span>
      <Link
        href={whatsappHref(brand.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap hover:text-primary transition-colors min-h-11 sm:min-h-0 py-1"
      >
        <MessageCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
        <span>WhatsApp for orders & quotes</span>
      </Link>
      <span className="text-gray-600 text-xs hidden sm:inline" aria-hidden>
        |
      </span>
      <Link
        href={phoneTelHref(brand.primaryPhone)}
        className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap hover:text-primary transition-colors min-h-11 sm:min-h-0 py-1"
      >
        <Phone className="h-3.5 w-3.5 shrink-0" />
        <span>{formatPhoneDisplay(brand.primaryPhone)}</span>
      </Link>
    </>
  );
}

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(213,0,0,0.15)_0%,transparent_50%,rgba(213,0,0,0.15)_100%)]" />
      <div className="relative flex items-center gap-3 py-2 pl-4 pr-2 sm:pr-4">
        {/* Mobile: static layout for easier tapping */}
        <div className="sm:hidden flex-1 min-w-0 flex flex-col gap-0.5 py-0.5">
          <AnnouncementContent />
        </div>

        {/* Desktop: scrolling marquee */}
        <div
          className="announcement-marquee hidden sm:flex flex-1 min-w-0"
          role="marquee"
          aria-label="Store announcements"
        >
          <div className="announcement-marquee-track">
            <div className="flex items-center gap-6 pr-6 shrink-0">
              <AnnouncementContent />
            </div>
            <div className="flex items-center gap-6 pr-6 shrink-0 pointer-events-none select-none" aria-hidden="true">
              <AnnouncementContent />
            </div>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-gray-400 hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center rounded-md hover:bg-white/10"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
