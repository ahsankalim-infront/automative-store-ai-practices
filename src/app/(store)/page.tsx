import { HeroBanner } from "@/components/home/hero-banner";
import { PromoBanners } from "@/components/home/promo-banners";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { VehicleSelector } from "@/components/home/vehicle-selector";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { ShopByCar } from "@/components/home/shop-by-car";
import { ShopByBrand } from "@/components/home/shop-by-brand";
import { ProductsSection } from "@/components/home/products-section";
import { FlashSale } from "@/components/home/flash-sale";
import { BundleOffers } from "@/components/home/bundle-offers";
import { PPFServicesBanner } from "@/components/home/ppf-services-banner";
import { CustomerReviews } from "@/components/home/customer-reviews";
import { BlogSection } from "@/components/home/blog-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { SignatureShowcase } from "@/components/home/signature-showcase";
import { SIGNATURE_CATEGORY_SLUGS } from "@/lib/brand/signature-categories";
import { JsonLdOrganization } from "@/components/seo/json-ld-organization";
import {
  getProducts,
  getCategories,
  getBrands,
  getVehicleMakes,
  getBlogPosts,
} from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("home");
}

export default async function HomePage() {
  const [allProducts, categories, brands, vehicleMakes, blogPosts] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getVehicleMakes(),
    getBlogPosts(),
  ]);

  const signatureProducts = allProducts.filter((p) =>
    SIGNATURE_CATEGORY_SLUGS.includes(p.categorySlug as (typeof SIGNATURE_CATEGORY_SLUGS)[number])
  );
  const featuredProducts = signatureProducts.length > 0
    ? signatureProducts.filter((p) => p.isFeatured)
    : allProducts.filter((p) => p.isFeatured);
  const bestSellers = allProducts.filter((p) => p.isBestSeller);
  const newArrivals = allProducts.filter((p) => p.isNew);
  const flashProducts = allProducts.filter((p) => p.isFlashSale);
  const saleProducts = flashProducts.length > 0 ? flashProducts : allProducts.slice(0, 4);

  return (
    <>
      <JsonLdOrganization />
      <div className="relative pb-6 sm:pb-10">
        <HeroBanner />
        <PromoBanners />
      </div>

      <WhyChooseUs />
      <SignatureShowcase />
      <VehicleSelector vehicleMakes={vehicleMakes} />
      <CategoriesGrid categories={categories} />

      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-screen-xl mx-auto px-4">
          <ProductsSection
            badge="Our Specialties"
            title="Top Products"
            subtitle="Car top covers, floor matting and custom seat covers — our most popular lines"
            products={featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8)}
            viewAllHref="/products"
          />
        </div>
      </section>

      <ShopByCar vehicleMakes={vehicleMakes} />
      <FlashSale saleProducts={saleProducts} />

      <section className="py-16 sm:py-20 bg-background section-pattern">
        <div className="max-w-screen-xl mx-auto px-4">
          <ProductsSection
            badge="Most Popular"
            title="Best Sellers"
            subtitle="Products our customers love the most"
            products={bestSellers}
            viewAllHref="/products?bestseller=true"
            cols={4}
          />
        </div>
      </section>

      <ShopByBrand brands={brands} />
      <BundleOffers />
      <PPFServicesBanner />

      <section className="py-16 sm:py-20 bg-card">
        <div className="max-w-screen-xl mx-auto px-4">
          <ProductsSection
            badge="Just Arrived"
            title="New Arrivals"
            subtitle="Latest products added to our store"
            products={newArrivals}
            viewAllHref="/products?new=true"
          />
        </div>
      </section>

      <CustomerReviews />
      <BlogSection posts={blogPosts} />
      <NewsletterSection />
    </>
  );
}
