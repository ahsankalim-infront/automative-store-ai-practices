"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Calendar, LayoutGrid } from "lucide-react";
import { CategoryLucideIcon } from "@/lib/icons/lucide-icon";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const pillBase =
  "shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-1 min-h-9 sm:min-h-0 text-[11px] sm:text-xs font-medium rounded-full border transition-all whitespace-nowrap";

function pillClass(active: boolean) {
  return cn(
    pillBase,
    active
      ? "bg-primary/10 text-primary border-primary/25 shadow-sm dark:bg-primary/15 dark:border-primary/30"
      : "bg-gray-50 text-gray-600 border-gray-200/90 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800/55 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-gray-600"
  );
}

export function StoreCategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = pathname === "/products" ? searchParams.get("category") : null;
  const bookServiceActive = pathname.startsWith("/services");

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) return null;

  const allActive = pathname === "/products" && !activeCategory;

  return (
    <div className="bg-gray-50/90 dark:bg-gray-900/90 border-y border-gray-200/80 dark:border-gray-800 sticky top-[var(--header-offset,3.5rem)] z-30 w-full min-w-0 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-1 sm:py-1.5">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide -mx-0.5 px-0.5">
          <Link href="/products" className={pillClass(allActive)}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm dark:bg-gray-900/50">
              <LayoutGrid className="h-3 w-3" aria-hidden />
            </span>
            <span className="truncate">All Products</span>
          </Link>

          {sorted.map((cat) => {
            const active = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={pillClass(active)}
                title={cat.name}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full shadow-sm",
                    active
                      ? "bg-white/90 text-primary dark:bg-gray-900/50"
                      : "bg-white/80 text-gray-500 dark:bg-gray-900/40 dark:text-gray-400"
                  )}
                >
                  <CategoryLucideIcon name={cat.icon} className="h-3 w-3" />
                </span>
                <span className="truncate max-w-[8.5rem] sm:max-w-none">{cat.name}</span>
              </Link>
            );
          })}

          <Link
            href="/services/book"
            className={cn(
              pillBase,
              bookServiceActive
                ? "bg-primary/10 text-primary border-primary/25 dark:bg-primary/15"
                : "bg-gray-50 text-gray-600 border-gray-200/90 hover:bg-gray-100 dark:bg-gray-800/55 dark:text-gray-300 dark:border-gray-700"
            )}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm dark:bg-gray-900/50">
              <Calendar className="h-3 w-3" aria-hidden />
            </span>
            <span>Book Service</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
