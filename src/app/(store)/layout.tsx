import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-floating-button";
import { MobileStoreNavProvider } from "@/components/layout/mobile-store-nav";
import { StoreCategoryBar } from "@/components/layout/store-category-bar";
import { BrandProvider } from "@/lib/brand/brand-context";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import { getCategories } from "@/lib/api/server";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, brand] = await Promise.all([getCategories(), getBrandConfig()]);

  return (
    <BrandProvider brand={brand}>
      <MobileStoreNavProvider categories={categories}>
        <div className="flex flex-col min-h-screen min-w-0 overflow-x-hidden [--header-offset:3.5rem] sm:[--header-offset:4rem] lg:[--header-offset:6.375rem]">
          <AnnouncementBar />
          <Header categories={categories} />
          <Suspense fallback={null}>
            <StoreCategoryBar categories={categories} />
          </Suspense>
          <main className="flex-1 lg:pb-0">
            {children}
          </main>
          <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <Footer />
          </div>
          <WhatsAppFloatingButton />
        </div>
      </MobileStoreNavProvider>
    </BrandProvider>
  );
}
