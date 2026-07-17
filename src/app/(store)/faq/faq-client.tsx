"use client";

import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import { HelpPageHero, HelpSidebar } from "@/components/help/help-page-shell";
import { FaqAccordion } from "@/components/help/faq-accordion";
import { buildFaqItems, HELP_LAST_UPDATED } from "@/lib/help/content";
import { useBrand } from "@/lib/brand/brand-context";

export default function FaqClient() {
  const brand = useBrand();
  const faqItems = useMemo(() => buildFaqItems(brand), [brand]);

  return (
    <div className="min-h-screen bg-background">
      <HelpPageHero
        icon={HelpCircle}
        title="Frequently Asked Questions"
        description="Answers about orders, custom seat covers, floor matting, delivery, returns, and our Lahore poshish studio."
        breadcrumb="FAQ"
        updated={HELP_LAST_UPDATED}
      />
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-8 items-start">
          <HelpSidebar activeHref="/faq" />
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}
