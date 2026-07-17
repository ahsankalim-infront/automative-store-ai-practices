import { searchCatalog } from "@/lib/search/catalog-search";
import { ok, fail } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 8;

  if (!q.trim()) {
    return fail("Query parameter q is required", 400);
  }

  if (q.trim().length < 2) {
    return ok({
      query: q.trim(),
      products: [],
      categories: [],
      brands: [],
      totalProducts: 0,
    });
  }

  const result = await searchCatalog(q, { limit: Number.isFinite(limit) ? limit : 8 });
  return ok(result, 200, 30);
}
