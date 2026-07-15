"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  applyCatalogFilters,
  buildCatalogQueryString,
  categoriesFromQuery,
  type CatalogQuery,
} from "@/lib/products/catalog-filters";
import type { Brand, Category, Product, SortOption } from "@/types";

const ITEMS_PER_PAGE = 12;

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Popularity", value: "popularity" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rated", value: "rating" },
];

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  initialQuery: CatalogQuery;
}

function maxProductPrice(products: Product[]) {
  return products.reduce((max, p) => Math.max(max, p.price), 200000);
}

export function ProductsClient({ products, categories, brands, initialQuery }: ProductsClientProps) {
  const router = useRouter();
  const priceMax = useMemo(() => maxProductPrice(products), [products]);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(initialQuery.q ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoriesFromQuery(initialQuery.category)
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialQuery.brand ? [initialQuery.brand] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, priceMax]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [vehicleQuery, setVehicleQuery] = useState({
    make: initialQuery.make,
    model: initialQuery.model,
    year: initialQuery.year,
  });

  useEffect(() => {
    setSearch(initialQuery.q ?? "");
    setSelectedCategories(categoriesFromQuery(initialQuery.category));
    setSelectedBrands(initialQuery.brand ? [initialQuery.brand] : []);
    setVehicleQuery({
      make: initialQuery.make,
      model: initialQuery.model,
      year: initialQuery.year,
    });
    setPage(1);
  }, [initialQuery]);

  useEffect(() => {
    setPriceRange(([min]) => [min, priceMax]);
  }, [priceMax]);

  const syncUrl = useCallback(
    (next: {
      categories: string[];
      brands: string[];
      search: string;
      vehicle: { make?: string; model?: string; year?: number };
    }) => {
      const qs = buildCatalogQueryString({
        categories: next.categories,
        brands: next.brands,
        search: next.search,
        make: next.vehicle.make,
        model: next.vehicle.model,
        year: next.vehicle.year,
      });
      router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    },
    [router]
  );

  const toggleFilter = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    setArr(next);
    setPage(1);
    syncUrl({
      categories: setArr === setSelectedCategories ? next : selectedCategories,
      brands: setArr === setSelectedBrands ? next : selectedBrands,
      search,
      vehicle: vehicleQuery,
    });
  };

  const filtered = useMemo(() => {
    let result = applyCatalogFilters(
      products,
      {
        make: vehicleQuery.make,
        model: vehicleQuery.model,
        year: vehicleQuery.year,
      },
      {
        categories: selectedCategories,
        brands: selectedBrands,
        search,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        inStockOnly,
        onSaleOnly,
      }
    );

    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedBrands,
    inStockOnly,
    onSaleOnly,
    priceRange,
    sortBy,
    vehicleQuery,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeCategory =
    selectedCategories.length === 1
      ? categories.find((cat) => cat.slug === selectedCategories[0])
      : undefined;

  const vehicleLabel =
    vehicleQuery.make || vehicleQuery.model || vehicleQuery.year
      ? [
          vehicleQuery.make,
          vehicleQuery.model,
          vehicleQuery.year != null ? String(vehicleQuery.year) : undefined,
        ]
          .filter(Boolean)
          .join(" ")
      : null;

  const activeFilters = [
    ...selectedCategories.map((c) => ({
      type: "category" as const,
      value: c,
      label: categories.find((cat) => cat.slug === c)?.name || c,
    })),
    ...selectedBrands.map((b) => ({
      type: "brand" as const,
      value: b,
      label: brands.find((br) => br.slug === b)?.name || b,
    })),
    ...(vehicleLabel
      ? [{ type: "vehicle" as const, value: "vehicle", label: vehicleLabel }]
      : []),
    ...(inStockOnly ? [{ type: "stock" as const, value: "in-stock", label: "In Stock" }] : []),
    ...(onSaleOnly ? [{ type: "sale" as const, value: "on-sale", label: "On Sale" }] : []),
    ...(search ? [{ type: "search" as const, value: search, label: `"${search}"` }] : []),
  ];

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setPriceRange([0, priceMax]);
    setSearch("");
    setVehicleQuery({ make: undefined, model: undefined, year: undefined });
    setPage(1);
    router.replace("/products", { scroll: false });
  };

  const removeFilter = (f: (typeof activeFilters)[number]) => {
    if (f.type === "category") {
      const next = selectedCategories.filter((c) => c !== f.value);
      setSelectedCategories(next);
      syncUrl({ categories: next, brands: selectedBrands, search, vehicle: vehicleQuery });
    } else if (f.type === "brand") {
      const next = selectedBrands.filter((b) => b !== f.value);
      setSelectedBrands(next);
      syncUrl({ categories: selectedCategories, brands: next, search, vehicle: vehicleQuery });
    } else if (f.type === "vehicle") {
      setVehicleQuery({ make: undefined, model: undefined, year: undefined });
      syncUrl({ categories: selectedCategories, brands: selectedBrands, search, vehicle: {} });
    } else if (f.type === "stock") {
      setInStockOnly(false);
    } else if (f.type === "sale") {
      setOnSaleOnly(false);
    } else if (f.type === "search") {
      setSearch("");
      syncUrl({ categories: selectedCategories, brands: selectedBrands, search: "", vehicle: vehicleQuery });
    }
    setPage(1);
  };

  const FilterSidebar = () => (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-card rounded-2xl border border-border p-5 space-y-6 sticky top-36">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Filters</h3>
          {activeFilters.length > 0 && (
            <button type="button" onClick={clearAll} className="text-xs text-primary hover:underline">
              Clear All
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            onBlur={() =>
              syncUrl({
                categories: selectedCategories,
                brands: selectedBrands,
                search,
                vehicle: vehicleQuery,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                syncUrl({
                  categories: selectedCategories,
                  brands: selectedBrands,
                  search,
                  vehicle: vehicleQuery,
                });
              }
            }}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        {vehicleLabel && (
          <div className="rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5 text-xs">
            <p className="font-semibold text-foreground">Vehicle fit</p>
            <p className="text-gray-500 mt-0.5 capitalize">{vehicleLabel}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.slug)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors flex-1">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">{cat.productCount}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Brand</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand.slug)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors flex-1">
                  {brand.name}
                </span>
                {brand.isPrivateLabel && (
                  <Badge variant="primary" className="text-[10px] py-0">
                    OWN
                  </Badge>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
          <input
            type="range"
            min={0}
            max={priceMax}
            step={Math.max(500, Math.round(priceMax / 200))}
            value={priceRange[1]}
            onChange={(e) => {
              setPriceRange([priceRange[0], parseInt(e.target.value, 10)]);
              setPage(1);
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Availability</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => {
                  setOnSaleOnly(e.target.checked);
                  setPage(1);
                }}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">On Sale</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            ...(activeCategory ? [{ label: activeCategory.name }] : []),
          ]}
          className="mb-4"
        />

        {activeCategory && (
          <div className="mb-5">
            <h1 className="text-2xl font-black text-foreground">{activeCategory.name}</h1>
            {activeCategory.description && (
              <p className="text-sm text-gray-500 mt-1 max-w-2xl">{activeCategory.description}</p>
            )}
          </div>
        )}

        <div className="flex items-start gap-6">
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 flex"
              >
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setFiltersOpen(false)}
                  aria-hidden
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  className="relative h-full max-h-[100dvh] w-[min(20rem,calc(100vw-1rem))] max-w-[92vw] bg-card overflow-y-auto overscroll-contain p-4 sm:p-5 pt-12 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-surface transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <FilterSidebar />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:border-primary transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilters.length > 0 && (
                  <span className="h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
              <div className="flex-1 text-sm text-gray-500">
                <span className="font-semibold text-foreground">{filtered.length}</span> products found
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {activeFilters.map((f) => (
                  <span
                    key={`${f.type}-${f.value}`}
                    className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                  >
                    {f.label}
                    <button type="button" onClick={() => removeFilter(f)} aria-label={`Remove ${f.label}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setPage(1);
                  }}
                  className="appearance-none pl-3 pr-8 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card dark:text-white cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`h-9 w-9 flex items-center justify-center transition-colors ${view === "grid" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`h-9 w-9 flex items-center justify-center transition-colors ${view === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {paged.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms"
                action={{ label: "Clear Filters", onClick: clearAll }}
              />
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 items-stretch"
                    : "flex flex-col gap-3"
                }
              >
                {paged.map((product) => (
                  <div key={product.id} className={view === "grid" ? "h-full" : ""}>
                    <ProductCard product={product} view={view} />
                  </div>
                ))}
              </div>
            )}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
