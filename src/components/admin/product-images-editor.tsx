"use client";

import Image from "next/image";
import { Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/types";
import { emptyProductImage } from "@/lib/products/product-images";
import { cn } from "@/lib/utils";

interface ProductImagesEditorProps {
  value: ProductImage[];
  onChange: (value: ProductImage[]) => void;
  readOnly?: boolean;
  productName?: string;
}

export function ProductImagesEditor({
  value,
  onChange,
  readOnly = false,
  productName = "",
}: ProductImagesEditorProps) {
  const rows = value?.length ? value : [];

  const updateRow = (index: number, patch: Partial<ProductImage>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const setPrimary = (index: number) => {
    onChange(rows.map((row, i) => ({ ...row, isPrimary: i === index })));
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      next[0] = { ...next[0], isPrimary: true };
    }
    onChange(next);
  };

  const addRow = () => {
    const img = emptyProductImage(productName);
    if (rows.length === 0) img.isPrimary = true;
    onChange([...rows, img]);
  };

  if (readOnly) {
    if (!rows.length) {
      return <p className="text-sm text-gray-400 py-2">No images added.</p>;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-border overflow-hidden">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
              {row.url ? (
                <Image src={row.url} alt={row.alt || productName} fill className="object-cover" sizes="160px" />
              ) : null}
            </div>
            <div className="px-2 py-1.5 text-xs text-gray-500 truncate">
              {row.isPrimary ? "Primary · " : ""}
              {row.alt || row.url || "—"}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Add multiple product photos. Mark one as primary — it appears in listings and search results.
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 rounded-xl border border-dashed border-border px-4 py-6 text-center">
          No images yet. Add URLs from the Media Library or paste external links.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id ?? index}
              className="rounded-xl border border-border p-3 space-y-2 bg-card/50"
            >
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-border">
                  {row.url ? (
                    <Image
                      src={row.url}
                      alt={row.alt || productName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400 px-1 text-center">
                      Preview
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="url"
                    placeholder="Image URL (https://...)"
                    value={row.url}
                    onChange={(e) => updateRow(index, { url: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Alt text (optional)"
                    value={row.alt}
                    onChange={(e) => updateRow(index, { alt: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-2.5 py-1.5 transition-colors",
                    row.isPrimary
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Star className={cn("h-3.5 w-3.5", row.isPrimary && "fill-current")} />
                  {row.isPrimary ? "Primary image" : "Set as primary"}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="gap-1.5">
        <Plus className="h-4 w-4" />
        Add image
      </Button>
    </div>
  );
}
