import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getStore } from "@/lib/data/store";
import { DEFAULT_SEO_CONFIG } from "./defaults";
import type { SeoConfig, SeoGlobalSettings, SeoPageEntry, SeoPageKey } from "./types";

const COLLECTION = "seo";

async function readSeoRaw(): Promise<SeoConfig> {
  const items = await getStore().read<SeoConfig>(COLLECTION);
  if (!items[0]) return DEFAULT_SEO_CONFIG;
  return {
    ...DEFAULT_SEO_CONFIG,
    ...items[0],
    global: { ...DEFAULT_SEO_CONFIG.global, ...items[0].global },
    pages: { ...DEFAULT_SEO_CONFIG.pages, ...items[0].pages },
  };
}

export const getSeoConfig = cache(
  unstable_cache(readSeoRaw, ["seo-config"], {
    revalidate: 60,
    tags: ["seo"],
  })
);

export function revalidateSeoTag() {
  revalidateTag("seo", "default");
}

export async function updateSeoConfig(data: {
  global?: Partial<SeoGlobalSettings>;
  pages?: Partial<Record<SeoPageKey, Partial<SeoPageEntry>>>;
}): Promise<SeoConfig> {
  const current = await readSeoRaw();
  const updated: SeoConfig = {
    ...current,
    global: { ...current.global, ...data.global },
    pages: { ...current.pages },
    updatedAt: new Date().toISOString(),
  };

  if (data.pages) {
    for (const [key, val] of Object.entries(data.pages)) {
      const k = key as SeoPageKey;
      if (updated.pages[k] && val) {
        updated.pages[k] = { ...updated.pages[k], ...val };
      }
    }
  }

  const items = await getStore().read<SeoConfig>(COLLECTION);
  if (items.length === 0) {
    await getStore().create(COLLECTION, updated);
  } else {
    await getStore().update(COLLECTION, current.id, updated);
  }

  revalidateSeoTag();
  return updated;
}
