import { getBundleOffers } from "@/lib/data/repositories";
import { getBundleOffersSection } from "@/lib/bundles/config";
import type { BundleOffer, BundleOffersSectionConfig } from "@/types";

export async function getHomeBundleOffersData(): Promise<{
  section: BundleOffersSectionConfig;
  offers: BundleOffer[];
}> {
  const [section, offers] = await Promise.all([getBundleOffersSection(), getBundleOffers()]);
  if (!section.isEnabled) {
    return { section, offers: [] };
  }
  return { section, offers };
}
