"use client";

import Link from "next/link";
import { ChevronRight, Phone, Mail, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref, whatsappHref } from "@/lib/brand/config";
import { HELP_LINKS } from "@/lib/help/content";
import type { LucideIcon } from "lucide-react";

interface HelpPageHeroProps {
  icon: LucideIcon;
  title: string;
  description: string;
  breadcrumb: string;
  updated?: string;
}

export function HelpPageHero({ icon: Icon, title, description, breadcrumb, updated }: HelpPageHeroProps) {
  return (
    <div className="bg-gradient-to-br from-secondary via-gray-900 to-secondary border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 py-12 sm:py-16">
        <Breadcrumb items={[{ label: breadcrumb }]} className="mb-6 [&_*]:text-gray-400 [&_a:hover]:text-white" />
        <div className="flex items-start gap-5">
          <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{title}</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">{description}</p>
            {updated && (
              <p className="text-xs text-gray-500 mt-4">
                Last updated: <strong className="text-gray-300">{updated}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelpSidebar({ activeHref }: { activeHref: string }) {
  const brand = useBrand();

  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-border">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Help Center</p>
        </div>
        <nav className="p-2">
          {HELP_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeHref === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-surface hover:text-foreground"
              }`}
            >
              {link.label}
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
        <p className="text-sm font-bold text-foreground">Need personal help?</p>
        <p className="text-xs text-gray-500">Our poshish experts are available during business hours.</p>
        <a
          href={phoneTelHref(brand.primaryPhone)}
          className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
        >
          <Phone className="h-4 w-4" />
          {formatPhoneDisplay(brand.primaryPhone)}
        </a>
        <a
          href={whatsappHref(brand.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-600 font-semibold hover:underline"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp us
        </a>
        <a
          href={`mailto:${brand.email}`}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          <Mail className="h-4 w-4" />
          {brand.email}
        </a>
        <Link href="/contact" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
          Contact form <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}
