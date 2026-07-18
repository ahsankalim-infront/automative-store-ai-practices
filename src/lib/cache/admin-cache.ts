import { revalidatePath, revalidateTag } from "next/cache";

export type CacheGroupId =
  | "catalog"
  | "content"
  | "marketing"
  | "settings"
  | "seo"
  | "layout"
  | "about";

export interface CacheGroup {
  id: CacheGroupId;
  label: string;
  description: string;
  tags: string[];
}

/** All Next.js cache tags used across the app (unstable_cache). */
export const CACHE_GROUPS: CacheGroup[] = [
  {
    id: "catalog",
    label: "Catalog",
    description: "Products, categories, brands, vehicles, reviews",
    tags: ["products", "categories", "brands", "vehicles"],
  },
  {
    id: "content",
    label: "Content",
    description: "Blogs, services, stores",
    tags: ["blogs", "services", "stores"],
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Banners, hero slides, promotion popups, bundle offers",
    tags: ["banners", "hero-slides", "promotion-popups", "bundle-offers", "bundle-offers-section"],
  },
  {
    id: "about",
    label: "About page",
    description: "About team, milestones, journey & leadership sections",
    tags: [
      "about-team",
      "about-milestones",
      "about-journey-section",
      "about-leadership-section",
      "about-content",
    ],
  },
  {
    id: "layout",
    label: "Homepage layout",
    description: "Home section order (desktop / mobile)",
    tags: ["home-layout"],
  },
  {
    id: "seo",
    label: "SEO",
    description: "Global SEO and page meta config",
    tags: ["seo"],
  },
  {
    id: "settings",
    label: "Store settings",
    description: "Brand / store profile, shipping, contact",
    tags: ["store-settings"],
  },
];

export function getAllCacheTags(): string[] {
  const tags = new Set<string>();
  for (const group of CACHE_GROUPS) {
    for (const tag of group.tags) tags.add(tag);
  }
  return [...tags];
}

export function clearCacheTags(tags: string[]): string[] {
  const cleared: string[] = [];
  for (const tag of tags) {
    revalidateTag(tag, "default");
    cleared.push(tag);
  }
  return cleared;
}

export function clearCacheGroup(groupId: CacheGroupId): { groupId: CacheGroupId; tags: string[] } {
  const group = CACHE_GROUPS.find((g) => g.id === groupId);
  if (!group) throw new Error(`Unknown cache group: ${groupId}`);
  const tags = clearCacheTags(group.tags);
  return { groupId, tags };
}

/** Clears every known data-cache tag and refreshes the storefront layout. */
export function clearAllApplicationCache(): { tags: string[]; paths: string[] } {
  const tags = clearCacheTags(getAllCacheTags());
  const paths = ["/", "/admin"];
  for (const path of paths) {
    revalidatePath(path, "layout");
  }
  return { tags, paths };
}
