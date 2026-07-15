import { ProductsClient } from "./products-client";
import { getProducts, getCategories, getBrands } from "@/lib/api/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { parseCatalogQuery } from "@/lib/products/catalog-filters";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("products");
}

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const initialQuery = parseCatalogQuery(params);

  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <ProductsClient
      products={products}
      categories={categories}
      brands={brands}
      initialQuery={initialQuery}
    />
  );
}
