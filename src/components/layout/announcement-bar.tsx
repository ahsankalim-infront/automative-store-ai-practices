"use client";
import { useState } from "react";
import { X, Truck, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { BRAND, formatPhoneDisplay, phoneTelHref, whatsappHref } from "@/lib/brand/config";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(213,0,0,0.15)_0%,transparent_50%,rgba(213,0,0,0.15)_100%)]" />
      <div className="relative max-w-screen-xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1">
          <div className="flex items-center gap-2 text-xs whitespace-nowrap shrink-0">
            <LogoMark size="sm" className="opacity-95" />
            <Truck className="h-3.5 w-3.5 text-primary hidden sm:block" />
            <span><strong>{BRAND.name}</strong> · Premium poshish & seat covers</span>
          </div>
          <span className="hidden sm:block text-gray-600">|</span>
          <Link href={whatsappHref()} target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0 hover:text-primary transition-colors">
            <MessageCircle className="h-3.5 w-3.5 text-green-400" />
            <span>WhatsApp for orders & quotes</span>
          </Link>
          <span className="hidden md:block text-gray-600">|</span>
          <Link href={phoneTelHref(BRAND.primaryPhone)}
            className="hidden md:flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0 hover:text-primary transition-colors">
            <Phone className="h-3.5 w-3.5" />
            <span>{formatPhoneDisplay(BRAND.primaryPhone)}</span>
          </Link>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-gray-400 hover:text-white transition-colors p-0.5"
          aria-label="Close announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
