import { cache } from "react";
import { unstable_cache, revalidateTag } from "next/cache";
import { getStore } from "./store";
import type { Product, Category, Brand, VehicleMake, BlogPost, Service, Store, Banner } from "@/types";

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

export function revalidateCatalogTag(resource: string) {
  const tags: Record<string, string> = {
    products: "products",
    categories: "categories",
    brands: "brands",
    "vehicle-makes": "vehicles",
    vehicles: "vehicles",
    blogs: "blogs",
    services: "services",
    stores: "stores",
    banners: "banners",
    reviews: "products",
  };
  const tag = tags[resource];
  if (tag) revalidateTag(tag, "default");
}
