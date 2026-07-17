import { unstable_cache, revalidateTag } from "next/cache";
import { getStoreSettings } from "@/lib/data/repositories";
import { DEFAULT_BRAND, storeSettingsToBrand } from "./config";

export const getBrandConfig = unstable_cache(
  async () => storeSettingsToBrand(await getStoreSettings()),
  ["store-brand-config"],
  { revalidate: 60, tags: ["store-settings"] }
);

export function revalidateStoreSettings(): void {
  revalidateTag("store-settings", "default");
}

export { DEFAULT_BRAND as BRAND };
