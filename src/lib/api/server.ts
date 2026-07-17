import { APP_URL } from "@/lib/data/config";

/** Server-side fetch helper — uses internal API routes */
export async function serverFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${APP_URL}/api${path}`, {
      next: { revalidate },
    });
    const json = await res.json();
    if (json.success) return json.data as T;
    return null;
  } catch {
    return null;
  }
}

/** Direct repository access for server components (same data layer as API) */
export {
  getProducts,
  getProductBySlug,
  getCategories,
  getBrands,
  getVehicleMakes,
  getBlogPosts,
  getBlogBySlug,
  getServices,
  getStores,
  getBanners,
  getBundleOffers,
  getReviews,
  getPromotionPopup,
} from "@/lib/data/repositories";
export { getBundleOffersSection } from "@/lib/bundles/config";
export { getHomeBundleOffersData } from "@/lib/bundles";
