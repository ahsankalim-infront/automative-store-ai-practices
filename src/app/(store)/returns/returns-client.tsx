"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { HelpPageHero, HelpSidebar } from "@/components/help/help-page-shell";
import { PolicySections } from "@/components/help/policy-sections";
import { buildReturnsSections, HELP_LAST_UPDATED } from "@/lib/help/content";
import { useBrand } from "@/lib/brand/brand-context";

export default function ReturnsClient() {
  const brand = useBrand();
  const sections = useMemo(() => buildReturnsSections(brand), [brand]);

  return (
    <div className="min-h-screen bg-background">
      <HelpPageHero
        icon={RotateCcw}
        title="Returns & Refunds"
        description="Our return, exchange, and refund guidelines for standard products and custom poshish items."
        breadcrumb="Returns & Refunds"
        updated={HELP_LAST_UPDATED}
      />
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-8 items-start">
          <HelpSidebar activeHref="/returns" />
          <PolicySections sections={sections} />
        </div>
      </div>
    </div>
  );
}
