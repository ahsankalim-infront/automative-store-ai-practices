"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductSpecification } from "@/types";
import { emptySpecification } from "@/lib/products/specs-fitment";

interface ProductSpecificationsEditorProps {
  value: ProductSpecification[];
  onChange: (value: ProductSpecification[]) => void;
  readOnly?: boolean;
}

export function ProductSpecificationsEditor({
  value,
  onChange,
  readOnly = false,
}: ProductSpecificationsEditorProps) {
  const rows = value?.length ? value : [];

  const updateRow = (index: number, patch: Partial<ProductSpecification>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...rows, emptySpecification()]);
  };

  if (readOnly) {
    if (!rows.length) {
      return <p className="text-sm text-gray-400 py-2">No specifications added.</p>;
    }
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.id ?? i}
            className={`flex gap-3 px-3 py-2 text-sm ${i % 2 ? "bg-gray-50 dark:bg-gray-800/40" : ""}`}
          >
            <span className="text-gray-500 w-32 shrink-0">{row.label || "—"}</span>
            <span className="font-medium text-foreground">{row.value || "—"}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Add technical specs (e.g. Wattage, Material, Dimensions). Shown on the product page under the Specs tab.
      </p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 rounded-xl border border-dashed border-border px-4 py-6 text-center">
          No specifications yet. Add rows for wattage, size, material, warranty, etc.
        </p>
      ) : (
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div key={row.id ?? index} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="text"
                placeholder="Label (e.g. Wattage)"
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
              />
              <input
                type="text"
                placeholder="Value (e.g. 85W)"
                value={row.value}
                onChange={(e) => updateRow(index, { value: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 text-red-500 hover:text-red-600"
                onClick={() => removeRow(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button type="button" size="sm" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addRow}>
        Add specification
      </Button>
    </div>
  );
}
