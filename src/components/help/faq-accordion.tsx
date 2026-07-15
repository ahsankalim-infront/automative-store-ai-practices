"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/help/content";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const catOk = activeCategory === "All" || item.category === activeCategory;
      const textOk =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return catOk && textOk;
    });
  }, [items, query, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-9 pr-4 py-3 text-sm border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary bg-card dark:bg-gray-900"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-card text-gray-600 dark:text-gray-400 border-border hover:border-primary/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">No questions match your search.</p>
        ) : (
          filtered.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-surface/50 transition-colors"
                  aria-expanded={open}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                      {item.category}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-foreground">{item.question}</p>
                  </div>
                  <ChevronDown
                    className={cn("h-5 w-5 text-gray-400 shrink-0 transition-transform mt-1", open && "rotate-180")}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-border pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
