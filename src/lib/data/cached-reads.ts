import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getStore } from "./store";
import { revalidateEntityCache } from "@/lib/cache/entity-cache";
import type { Product, Category, Brand, VehicleMake, BlogPost, Service, Store, Banner, BundleOffer, AboutTeamMember, AboutMilestone, HeroSlide, PromotionPopup } from "@/types";

const REVALIDATE_SECONDS = 60;

function cachedRead<T>(collection: string, tag: string) {
  return cache(
    unstable_cache(
      async () => getStore().read<T>(collection),
      [`json-${collection}`],
      { revalidate: REVALIDATE_SECONDS, tags: [tag] }
    )
  );
}

export const readAllProducts = cachedRead<Product>("products", "products");
export const readAllCategories = cachedRead<Category>("categories", "categories");
export const readAllBrands = cachedRead<Brand>("brands", "brands");
export const readAllVehicleMakes = cachedRead<VehicleMake>("vehicle-makes", "vehicles");
export const readAllBlogPosts = cachedRead<BlogPost>("blogs", "blogs");
export const readAllServices = cachedRead<Service>("services", "services");
export const readAllStores = cachedRead<Store>("stores", "stores");
export const readAllBanners = cachedRead<Banner>("banners", "banners");
export const readAllBundleOffers = cachedRead<BundleOffer>("bundle-offers", "bundle-offers");
export const readAllAboutTeam = cachedRead<AboutTeamMember>("about-team", "about-team");
export const readAllAboutMilestones = cachedRead<AboutMilestone>("about-milestones", "about-milestones");
export const readAllHeroSlides = cachedRead<HeroSlide>("hero-slides", "hero-slides");
export const readAllPromotionPopups = cachedRead<PromotionPopup>("promotion-popups", "promotion-popups");

/** @deprecated Prefer revalidateEntityCache — kept for existing admin route imports */
export function revalidateCatalogTag(resource: string) {
  revalidateEntityCache(resource);
}
