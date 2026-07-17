import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getStore } from "@/lib/data/store";
import { DEFAULT_BUNDLE_OFFERS_SECTION } from "./defaults";
import type { BundleOffersSectionConfig } from "@/types";

const COLLECTION = "bundle-offers-section";

async function readBundleSectionRaw(): Promise<BundleOffersSectionConfig> {
  const items = await getStore().read<BundleOffersSectionConfig>(COLLECTION);
  if (!items[0]) return DEFAULT_BUNDLE_OFFERS_SECTION;
  return { ...DEFAULT_BUNDLE_OFFERS_SECTION, ...items[0] };
}

export const getBundleOffersSection = cache(
  unstable_cache(readBundleSectionRaw, ["bundle-offers-section"], {
    revalidate: 60,
    tags: ["bundle-offers-section"],
  })
);

export function revalidateBundleOffersSectionTag() {
  revalidateTag("bundle-offers-section", "default");
}

export async function updateBundleOffersSection(
  data: Partial<BundleOffersSectionConfig>
): Promise<BundleOffersSectionConfig> {
  const current = await readBundleSectionRaw();
  const updated: BundleOffersSectionConfig = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const items = await getStore().read<BundleOffersSectionConfig>(COLLECTION);
  if (items.length === 0) {
    await getStore().create(COLLECTION, updated);
  } else {
    await getStore().update(COLLECTION, current.id, updated);
  }

  revalidateBundleOffersSectionTag();
  revalidateTag("bundle-offers", "default");
  return updated;
}
