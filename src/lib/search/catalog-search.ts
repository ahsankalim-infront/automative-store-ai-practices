import { getProducts, getCategories, getBrands } from "@/lib/data/repositories";
import { productMatchesSearch } from "@/lib/products/catalog-filters";

export interface SearchCategoryHit {
  name: string;
  slug: string;
  productCount?: number;
}

export interface SearchBrandHit {
  name: string;
  slug: string;
}

export interface CatalogSearchResult {
  query: string;
  products: import("@/types").Product[];
  categories: SearchCategoryHit[];
  brands: SearchBrandHit[];
  totalProducts: number;
}

export async function searchCatalog(
  rawQuery: string,
  options: { limit?: number } = {}
): Promise<CatalogSearchResult> {
  const query = rawQuery.trim();
  const limit = Math.min(Math.max(options.limit ?? 8, 1), 24);

  if (query.length < 2) {
    return { query, products: [], categories: [], brands: [], totalProducts: 0 };
  }

  const ql = query.toLowerCase();

  const [products, categories, brands] = await Promise.all([
    getProducts({ search: query }),
    getCategories(),
    getBrands(),
  ]);

  const matchedCategories = categories
    .filter((c) => c.name.toLowerCase().includes(ql) || c.slug.includes(ql))
    .slice(0, 4)
    .map((c) => ({ name: c.name, slug: c.slug, productCount: c.productCount }));

  const matchedBrands = brands
    .filter((b) => b.name.toLowerCase().includes(ql) || b.slug.includes(ql))
    .slice(0, 4)
    .map((b) => ({ name: b.name, slug: b.slug }));

  return {
    query,
    products: products.slice(0, limit),
    categories: matchedCategories,
    brands: matchedBrands,
    totalProducts: products.length,
  };
}

export { productMatchesSearch };
