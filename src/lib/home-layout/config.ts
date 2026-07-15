import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getStore } from "@/lib/data/store";
import {
  DEFAULT_HOME_LAYOUT,
  normalizeSectionList,
  resolveActiveSections,
} from "./defaults";
import type { HomeLayoutConfig, HomeSectionConfig, HomeSectionKey } from "./types";

const COLLECTION = "home-layout";

async function readHomeLayoutRaw(): Promise<HomeLayoutConfig> {
  const items = await getStore().read<HomeLayoutConfig>(COLLECTION);
  if (!items[0]) return DEFAULT_HOME_LAYOUT;

  const raw = items[0];
  return {
    ...DEFAULT_HOME_LAYOUT,
    ...raw,
    desktop: normalizeSectionList(raw.desktop, DEFAULT_HOME_LAYOUT.desktop),
    mobile: normalizeSectionList(raw.mobile, DEFAULT_HOME_LAYOUT.mobile),
  };
}

export const getHomeLayout = cache(
  unstable_cache(readHomeLayoutRaw, ["home-layout-config"], {
    revalidate: 60,
    tags: ["home-layout"],
  })
);

export async function getHomeSectionOrder(viewport: "desktop" | "mobile"): Promise<HomeSectionKey[]> {
  const config = await getHomeLayout();
  const list = viewport === "mobile" ? config.mobile : config.desktop;
  return resolveActiveSections(list);
}

export function revalidateHomeLayoutTag() {
  revalidateTag("home-layout", "default");
}

export async function updateHomeLayout(data: {
  desktop?: HomeSectionConfig[];
  mobile?: HomeSectionConfig[];
}): Promise<HomeLayoutConfig> {
  const current = await readHomeLayoutRaw();
  const updated: HomeLayoutConfig = {
    ...current,
    desktop: data.desktop
      ? normalizeSectionList(data.desktop, current.desktop)
      : current.desktop,
    mobile: data.mobile
      ? normalizeSectionList(data.mobile, current.mobile)
      : current.mobile,
    updatedAt: new Date().toISOString(),
  };

  const items = await getStore().read<HomeLayoutConfig>(COLLECTION);
  if (items.length === 0) {
    await getStore().create(COLLECTION, updated);
  } else {
    await getStore().update(COLLECTION, current.id, updated);
  }

  revalidateHomeLayoutTag();
  return updated;
}
