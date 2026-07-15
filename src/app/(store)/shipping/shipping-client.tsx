"use client";

import { Truck } from "lucide-react";
import { HelpPageHero, HelpSidebar } from "@/components/help/help-page-shell";
import { PolicySections } from "@/components/help/policy-sections";
import { SHIPPING_SECTIONS, HELP_LAST_UPDATED } from "@/lib/help/content";

export default function ShippingClient() {
  return (
    <div className="min-h-screen bg-background">
      <HelpPageHero
        icon={Truck}
        title="Shipping Policy"
        description="Nationwide delivery across Pakistan, Lahore priority dispatch, and timelines for custom poshish orders."
        breadcrumb="Shipping Policy"
        updated={HELP_LAST_UPDATED}
      />
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-8 items-start">
          <HelpSidebar activeHref="/shipping" />
          <PolicySections sections={SHIPPING_SECTIONS} />
        </div>
      </div>
    </div>
  );
}
