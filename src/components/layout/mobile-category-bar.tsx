"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function MobileCategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = pathname === "/products" ? searchParams.get("category") : null;

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) return null;

  return (
    <div className="lg:hidden bg-card border-b border-border sticky top-16 z-30">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <Link
            href="/products"
            className={cn(
              "shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap",
              pathname === "/products" && !activeCategory
                ? "bg-primary text-white border-primary"
                : "bg-surface text-gray-600 dark:text-gray-400 border-border hover:border-primary/30"
            )}
          >
            All Products
          </Link>
          {sorted.map((cat) => {
            const active = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap",
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-gray-600 dark:text-gray-400 border-border hover:border-primary/30"
                )}
              >
                {cat.name}
              </Link>
            );
          })}
          <Link
            href="/services/book"
            className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-full bg-secondary text-white hover:bg-secondary/90 transition-colors whitespace-nowrap ml-1"
          >
            Book Service
          </Link>
        </div>
      </div>
    </div>
  );
}
