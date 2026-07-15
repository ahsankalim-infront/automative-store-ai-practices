import { getProducts } from "@/lib/data/repositories";
import { ok } from "@/lib/api/helpers";
import { parseCatalogQuery } from "@/lib/products/catalog-filters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = parseCatalogQuery(searchParams);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  const products = await getProducts({
    category: query.category,
    brand: query.brand,
    search: query.q,
    make: query.make,
    model: query.model,
    year: query.year,
    featured: searchParams.get("featured") === "true" || undefined,
    bestseller: searchParams.get("bestseller") === "true" || undefined,
    isNew: searchParams.get("new") === "true" || undefined,
    flashSale: searchParams.get("flashSale") === "true" || undefined,
    limit: limit && limit > 0 ? limit : undefined,
  });
  return ok(products);
}
