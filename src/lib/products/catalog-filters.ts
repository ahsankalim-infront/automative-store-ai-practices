import type { Product } from "@/types";

/** Query params supported on /products (from URL or API). */
export interface CatalogQuery {
  category?: string;
  brand?: string;
  /** Search text — `q` is the canonical URL param; `search` is accepted for API compat. */
  q?: string;
  make?: string;
  model?: string;
  year?: number;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function slugifyLabel(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCatalogQuery(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams
): CatalogQuery {
  const get = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      const v = searchParams.get(key);
      return v && v.length > 0 ? v : undefined;
    }
    return firstParam(searchParams[key]);
  };

  const yearRaw = get("year");
  const year = yearRaw ? Number(yearRaw) : undefined;

  return {
    category: get("category"),
    brand: get("brand"),
    q: get("q") ?? get("search"),
    make: get("make"),
    model: get("model"),
    year: year != null && !Number.isNaN(year) ? year : undefined,
  };
}

export function matchesVehicleFit(
  product: Product,
  make?: string,
  model?: string,
  year?: number
): boolean {
  if (!make && !model && year == null) return true;

  const fits = product.vehicleCompatibility;
  if (!fits || fits.length === 0) return true;

  return fits.some((fit) => {
    const fitMake = fit.makeSlug ?? slugifyLabel(fit.brand);
    const fitModel = fit.modelSlug ?? slugifyLabel(fit.model);

    if (make && fitMake !== make) return false;
    if (model && fitModel !== model) return false;
    if (year != null && (year < fit.yearFrom || year > fit.yearTo)) return false;
    return true;
  });
}

/** Apply catalog filters — same rules for API, server page, and client UI. */
export function applyCatalogFilters(
  products: Product[],
  query: CatalogQuery,
  ui?: {
    categories?: string[];
    brands?: string[];
    search?: string;
    priceMin?: number;
    priceMax?: number;
    inStockOnly?: boolean;
    onSaleOnly?: boolean;
  }
): Product[] {
  let items = [...products];

  const categories = ui?.categories?.length ? ui.categories : query.category ? [query.category] : [];
  const brands = ui?.brands?.length ? ui.brands : query.brand ? [query.brand] : [];
  const search = (ui?.search ?? query.q)?.trim().toLowerCase();

  if (categories.length) {
    items = items.filter((p) => categories.includes(p.categorySlug));
  }
  if (brands.length) {
    items = items.filter((p) => brands.includes(p.brandSlug));
  }
  if (search) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
  }
  if (query.make || query.model || query.year != null) {
    items = items.filter((p) => matchesVehicleFit(p, query.make, query.model, query.year));
  }

  if (ui) {
    if (ui.inStockOnly) items = items.filter((p) => p.inStock);
    if (ui.onSaleOnly) items = items.filter((p) => p.discount != null && p.discount > 0);
    if (ui.priceMin != null || ui.priceMax != null) {
      const min = ui.priceMin ?? 0;
      const max = ui.priceMax ?? Number.MAX_SAFE_INTEGER;
      items = items.filter((p) => p.price >= min && p.price <= max);
    }
  }

  return items;
}

export function buildCatalogQueryString(input: {
  categories?: string[];
  brands?: string[];
  search?: string;
  make?: string;
  model?: string;
  year?: number;
}): string {
  const params = new URLSearchParams();

  if (input.categories?.length === 1) params.set("category", input.categories[0]);
  else if (input.categories && input.categories.length > 1) {
    params.set("category", input.categories.join(","));
  }

  if (input.brands?.length === 1) params.set("brand", input.brands[0]);
  else if (input.brands && input.brands.length > 1) {
    params.set("brand", input.brands.join(","));
  }

  const q = input.search?.trim();
  if (q) params.set("q", q);

  if (input.make) params.set("make", input.make);
  if (input.model) params.set("model", input.model);
  if (input.year != null) params.set("year", String(input.year));

  return params.toString();
}

export function categoriesFromQuery(categoryParam?: string): string[] {
  if (!categoryParam) return [];
  return categoryParam.split(",").map((s) => s.trim()).filter(Boolean);
}
