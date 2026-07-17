"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Tag, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppImage as Image } from "@/components/ui/app-image";
import { formatPrice, cn } from "@/lib/utils";
import type { CatalogSearchResult } from "@/lib/search/catalog-search";
import type { Product } from "@/types";

interface HeaderSearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  result: CatalogSearchResult | null;
  closeSearch: () => void;
  goToAllResults: () => void;
  desktopRef: React.RefObject<HTMLDivElement | null>;
  mobileRef: React.RefObject<HTMLDivElement | null>;
}

const HeaderSearchContext = createContext<HeaderSearchContextValue | null>(null);

function useHeaderSearch() {
  const ctx = useContext(HeaderSearchContext);
  if (!ctx) throw new Error("HeaderSearch components must be used within HeaderSearchProvider");
  return ctx;
}

export function HeaderSearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CatalogSearchResult | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResult(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=6`);
        const json = await res.json();
        if (json.success && json.data) {
          setResult(json.data as CatalogSearchResult);
        } else {
          setResult(null);
        }
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-header-search]")) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResult(null);
  }, []);

  const goToAllResults = useCallback(() => {
    const q = query.trim();
    if (q.length < 2) return;
    closeSearch();
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }, [query, closeSearch, router]);

  return (
    <HeaderSearchContext.Provider
      value={{
        open,
        setOpen,
        query,
        setQuery,
        loading,
        result,
        closeSearch,
        goToAllResults,
        desktopRef,
        mobileRef,
      }}
    >
      {children}
    </HeaderSearchContext.Provider>
  );
}

function SearchResultsContent() {
  const { query, loading, result, closeSearch } = useHeaderSearch();

  const hasProducts = (result?.products.length ?? 0) > 0;
  const hasCategories = (result?.categories.length ?? 0) > 0;
  const hasBrands = (result?.brands.length ?? 0) > 0;

  if (query.trim().length < 2) return null;

  return (
    <>
      {loading && (
        <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          Searching…
        </div>
      )}

      {!loading && !hasProducts && !hasCategories && !hasBrands && (
        <div className="px-3 py-3 sm:px-4 sm:py-4 text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </div>
      )}

      {!loading && hasCategories && (
        <div className="px-3 pt-3 pb-1 sm:px-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Categories
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result!.categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onClick={closeSearch}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-colors max-w-full truncate"
              >
                <FolderOpen className="h-3 w-3 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && hasBrands && (
        <div className="px-3 pt-2 pb-1 sm:px-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Brands</p>
          <div className="flex flex-wrap gap-1.5">
            {result!.brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/products?brand=${brand.slug}`}
                onClick={closeSearch}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Tag className="h-3 w-3 shrink-0" />
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading &&
        result?.products.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            onClick={closeSearch}
            className="flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-t border-border min-h-[52px]"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden">
              {product.images[0]?.url ? (
                <Image src={product.images[0].url} alt={product.name} fill className="object-cover" sizes="40px" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 lg:line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {product.category} · {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}

      {!loading && hasProducts && (
        <Link
          href={`/products?q=${encodeURIComponent(query.trim())}`}
          onClick={closeSearch}
          className="block px-3 py-3 sm:px-4 text-sm text-primary font-medium border-t border-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center sm:text-left"
        >
          <span className="line-clamp-2 lg:line-clamp-1">
            View all {result!.totalProducts} result{result!.totalProducts === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </span>
        </Link>
      )}
    </>
  );
}

function computeDropdownStyle(anchor: HTMLElement): CSSProperties {
  const rect = anchor.getBoundingClientRect();
  const viewportPad = 12;
  const minWidth = 288;
  const maxWidth = Math.min(480, window.innerWidth - viewportPad * 2);
  const width = Math.min(Math.max(rect.width, minWidth), maxWidth);

  let left = rect.left;
  if (left + width > window.innerWidth - viewportPad) {
    left = window.innerWidth - viewportPad - width;
  }
  if (left < viewportPad) left = viewportPad;

  return {
    position: "fixed",
    top: rect.bottom + 4,
    left,
    width,
    zIndex: 60,
  };
}

function SearchResultsDropdown() {
  const { desktopRef, open, query, result, loading } = useHeaderSearch();
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = desktopRef.current;
    if (!anchor) return;
    setPanelStyle(computeDropdownStyle(anchor));
  }, [desktopRef]);

  useLayoutEffect(() => {
    if (!open || !isDesktop) {
      setPanelStyle(null);
      return;
    }
    updatePosition();
  }, [open, isDesktop, updatePosition, query, loading, result]);

  useEffect(() => {
    if (!open || !isDesktop) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, isDesktop, updatePosition]);

  if (!mounted || !isDesktop || !open || !panelStyle) return null;
  if (query.trim().length < 2) return null;

  return createPortal(
    <div
      data-header-search
      style={panelStyle}
      className="bg-card rounded-xl border border-border shadow-xl overflow-y-auto overscroll-contain max-h-[min(60dvh,420px)] animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <SearchResultsContent />
    </div>,
    document.body
  );
}

function SearchResultsInlinePanel() {
  const { query } = useHeaderSearch();
  if (query.trim().length < 2) return null;

  return (
    <div className="mt-2 max-h-[min(45dvh,320px)] w-full overflow-y-auto overscroll-contain bg-card rounded-xl border border-border shadow-lg">
      <SearchResultsContent />
    </div>
  );
}

const inputClass =
  "w-full min-w-0 pl-9 pr-4 text-sm bg-gray-50 dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all";

export function HeaderSearchDesktop() {
  const { desktopRef, query, setQuery, open, setOpen, goToAllResults } = useHeaderSearch();

  return (
    <div
      ref={desktopRef}
      data-header-search
      className="hidden md:block relative min-w-0 flex-1 max-w-xs lg:max-w-none lg:mx-3 xl:mx-4"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToAllResults();
        }}
        className="relative w-full"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className={cn(inputClass, "py-2 h-10")}
          aria-label="Search products"
          autoComplete="off"
        />
      </form>
      <SearchResultsDropdown />
    </div>
  );
}

export function HeaderSearchMobileToggle() {
  const { open, setOpen } = useHeaderSearch();

  return (
    <button
      type="button"
      data-header-search
      onClick={() => setOpen(!open)}
      className="md:hidden h-10 w-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors shrink-0"
      aria-label={open ? "Close search" : "Open search"}
      aria-expanded={open}
    >
      {open ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
    </button>
  );
}

export function HeaderSearchMobilePanel() {
  const { mobileRef, open, query, setQuery, goToAllResults, closeSearch } = useHeaderSearch();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close search overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[45] bg-black/40"
            onClick={closeSearch}
          />
          <motion.div
            ref={mobileRef}
            data-header-search
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden relative z-[46] border-t border-border bg-white dark:bg-gray-950 shadow-lg"
          >
            <div className="px-3 py-3 sm:px-4 max-w-screen-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goToAllResults();
                }}
                className="relative w-full"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search products, brands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className={cn(inputClass, "py-3 h-11 text-base sm:text-sm")}
                  aria-label="Search products"
                  autoComplete="off"
                />
              </form>
              <SearchResultsInlinePanel />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
