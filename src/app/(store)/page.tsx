import { JsonLdOrganization } from "@/components/seo/json-ld-organization";
import { HomePageContent } from "@/components/home/home-page-content";
import { PromotionPopupModal } from "@/components/promotion/promotion-popup-modal";
import { CarGameLauncher } from "@/components/game/car-game-launcher";
import { SIGNATURE_CATEGORY_SLUGS } from "@/lib/brand/signature-categories";
import { getHomeLayout } from "@/lib/home-layout/config";
import { getHomeBundleOffersData } from "@/lib/bundles";
import { getHeroSlides } from "@/lib/hero-slides";
import {
  getProducts,
  getCategories,
  getBrands,
  getVehicleMakes,
  getBlogPosts,
  getPromotionPopup,
} from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

export default async function HomePage() {
  const [layout, allProducts, categories, brands, vehicleMakes, blogPosts, bundleData, heroSlides, promotionPopup] = await Promise.all([
    getHomeLayout(),
    getProducts(),
    getCategories(),
    getBrands(),
    getVehicleMakes(),
    getBlogPosts(),
    getHomeBundleOffersData(),
    getHeroSlides(),
    getPromotionPopup(),
  ]);

  const signatureProducts = allProducts.filter((p) =>
    SIGNATURE_CATEGORY_SLUGS.includes(p.categorySlug as (typeof SIGNATURE_CATEGORY_SLUGS)[number])
  );
  const featuredProducts =
    signatureProducts.length > 0
      ? signatureProducts.filter((p) => p.isFeatured)
      : allProducts.filter((p) => p.isFeatured);
  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const newArrivals = allProducts.filter((p) => p.isNew);
  const flashProducts = allProducts.filter((p) => p.isFlashSale);
  const saleProducts = flashProducts.length > 0 ? flashProducts : allProducts.slice(0, 4);

  return (
    <>
      <JsonLdOrganization />
      {promotionPopup && <PromotionPopupModal popup={promotionPopup} />}
      <CarGameLauncher />
      <HomePageContent
        layout={layout}
        data={{
          featuredProducts:
            featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8),
          bestSellers: bestSellers.length > 0 ? bestSellers : allProducts.slice(0, 8),
          newArrivals: newArrivals.length > 0 ? newArrivals : allProducts.slice(0, 8),
          saleProducts,
          categories,
          brands,
          vehicleMakes,
          blogPosts,
          bundleSection: bundleData.section,
          bundleOffers: bundleData.offers,
          heroSlides,
        }}
      />
    </>
  );
}
