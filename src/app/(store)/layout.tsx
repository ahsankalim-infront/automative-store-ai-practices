import { Suspense } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStoreNavProvider } from "@/components/layout/mobile-store-nav";
import { StoreCategoryBar } from "@/components/layout/store-category-bar";
import { getCategories } from "@/lib/api/server";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <MobileStoreNavProvider categories={categories}>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Header categories={categories} />
        <Suspense fallback={null}>
          <StoreCategoryBar categories={categories} />
        </Suspense>
        <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          {children}
        </main>
        <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <Footer />
        </div>
      </div>
    </MobileStoreNavProvider>
  );
}
