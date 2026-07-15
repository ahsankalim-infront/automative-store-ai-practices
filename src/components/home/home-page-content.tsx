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
import { resolveActiveSections } from "@/lib/home-layout/defaults";
import type { HomeLayoutConfig, HomeSectionKey } from "@/lib/home-layout/types";
import type { BlogPost, Brand, Category, Product, VehicleMake } from "@/types";

export interface HomePageData {
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  saleProducts: Product[];
  categories: Category[];
  brands: Brand[];
  vehicleMakes: VehicleMake[];
  blogPosts: BlogPost[];
}

function SectionShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!className) return <>{children}</>;
  return (
    <section className={className}>
      <div className="max-w-screen-xl mx-auto px-4 w-full min-w-0">{children}</div>
    </section>
  );
}

function renderSection(key: HomeSectionKey, data: HomePageData) {
  switch (key) {
    case "hero":
      return (
        <div key={key} className="relative pb-2 sm:pb-8 md:pb-10 w-full min-w-0 overflow-x-hidden">
          <HeroBanner />
          <PromoBanners />
        </div>
      );
    case "why_choose_us":
      return <WhyChooseUs key={key} />;
    case "signature_showcase":
      return <SignatureShowcase key={key} />;
    case "vehicle_selector":
      return <VehicleSelector key={key} vehicleMakes={data.vehicleMakes} />;
    case "categories":
      return <CategoriesGrid key={key} categories={data.categories} />;
    case "top_products":
      return (
        <SectionShell key={key} className="py-12 sm:py-20 bg-card">
          <ProductsSection
            badge="Our Specialties"
            title="Top Products"
            subtitle="Car top covers, floor matting and custom seat covers — our most popular lines"
            products={data.featuredProducts}
            viewAllHref="/products"
          />
        </SectionShell>
      );
    case "shop_by_car":
      return <ShopByCar key={key} vehicleMakes={data.vehicleMakes} />;
    case "flash_sale":
      return <FlashSale key={key} saleProducts={data.saleProducts} />;
    case "best_sellers":
      return (
        <SectionShell key={key} className="py-12 sm:py-20 bg-background section-pattern">
          <ProductsSection
            badge="Most Popular"
            title="Best Sellers"
            subtitle="Products our customers love the most"
            products={data.bestSellers}
            viewAllHref="/products?bestseller=true"
            cols={4}
          />
        </SectionShell>
      );
    case "shop_by_brand":
      return <ShopByBrand key={key} brands={data.brands} />;
    case "bundle_offers":
      return <BundleOffers key={key} />;
    case "ppf_services":
      return <PPFServicesBanner key={key} />;
    case "new_arrivals":
      return (
        <SectionShell key={key} className="py-12 sm:py-20 bg-card">
          <ProductsSection
            badge="Just Arrived"
            title="New Arrivals"
            subtitle="Latest products added to our store"
            products={data.newArrivals}
            viewAllHref="/products?new=true"
          />
        </SectionShell>
      );
    case "customer_reviews":
      return <CustomerReviews key={key} />;
    case "blog":
      return <BlogSection key={key} posts={data.blogPosts} />;
    case "newsletter":
      return <NewsletterSection key={key} />;
    default:
      return null;
  }
}

function renderOrderedSections(order: HomeSectionKey[], data: HomePageData) {
  return order.map((key) => renderSection(key, data)).filter(Boolean);
}

export function HomePageContent({
  layout,
  data,
}: {
  layout: HomeLayoutConfig;
  data: HomePageData;
}) {
  const mobileOrder = resolveActiveSections(layout.mobile);
  const desktopOrder = resolveActiveSections(layout.desktop);

  return (
    <>
      <div className="lg:hidden flex flex-col w-full min-w-0 overflow-x-hidden">
        {renderOrderedSections(mobileOrder, data)}
      </div>
      <div className="hidden lg:flex lg:flex-col w-full min-w-0 overflow-x-hidden">
        {renderOrderedSections(desktopOrder, data)}
      </div>
    </>
  );
}
