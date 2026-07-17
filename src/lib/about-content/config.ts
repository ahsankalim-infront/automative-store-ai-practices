import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getStore } from "@/lib/data/store";
import {
  DEFAULT_ABOUT_JOURNEY_SECTION,
  DEFAULT_ABOUT_LEADERSHIP_SECTION,
} from "./defaults";
import type { AboutSectionConfig } from "@/types";

const JOURNEY_COLLECTION = "about-journey-section";
const LEADERSHIP_COLLECTION = "about-leadership-section";

async function readJourneySectionRaw(): Promise<AboutSectionConfig> {
  const items = await getStore().read<AboutSectionConfig>(JOURNEY_COLLECTION);
  if (!items[0]) return DEFAULT_ABOUT_JOURNEY_SECTION;
  return { ...DEFAULT_ABOUT_JOURNEY_SECTION, ...items[0] };
}

async function readLeadershipSectionRaw(): Promise<AboutSectionConfig> {
  const items = await getStore().read<AboutSectionConfig>(LEADERSHIP_COLLECTION);
  if (!items[0]) return DEFAULT_ABOUT_LEADERSHIP_SECTION;
  return { ...DEFAULT_ABOUT_LEADERSHIP_SECTION, ...items[0] };
}

export const getAboutJourneySection = cache(
  unstable_cache(readJourneySectionRaw, ["about-journey-section"], {
    revalidate: 60,
    tags: ["about-journey-section"],
  })
);

export const getAboutLeadershipSection = cache(
  unstable_cache(readLeadershipSectionRaw, ["about-leadership-section"], {
    revalidate: 60,
    tags: ["about-leadership-section"],
  })
);

export function revalidateAboutJourneySectionTag(): void {
  revalidateTag("about-journey-section", "default");
}

export function revalidateAboutLeadershipSectionTag(): void {
  revalidateTag("about-leadership-section", "default");
}

export async function updateAboutJourneySection(
  data: Partial<AboutSectionConfig>
): Promise<AboutSectionConfig> {
  const current = await readJourneySectionRaw();
  const updated: AboutSectionConfig = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const items = await getStore().read<AboutSectionConfig>(JOURNEY_COLLECTION);
  if (items.length === 0) {
    await getStore().create(JOURNEY_COLLECTION, updated);
  } else {
    await getStore().update(JOURNEY_COLLECTION, current.id, updated);
  }

  revalidateAboutJourneySectionTag();
  revalidateTag("about-content", "default");
  return updated;
}

export async function updateAboutLeadershipSection(
  data: Partial<AboutSectionConfig>
): Promise<AboutSectionConfig> {
  const current = await readLeadershipSectionRaw();
  const updated: AboutSectionConfig = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const items = await getStore().read<AboutSectionConfig>(LEADERSHIP_COLLECTION);
  if (items.length === 0) {
    await getStore().create(LEADERSHIP_COLLECTION, updated);
  } else {
    await getStore().update(LEADERSHIP_COLLECTION, current.id, updated);
  }

  revalidateAboutLeadershipSectionTag();
  revalidateTag("about-content", "default");
  return updated;
}
