"use client";

import { CATEGORY_ICON_OPTIONS, CategoryLucideIcon } from "@/lib/icons/lucide-icon";
import { cn } from "@/lib/utils";

interface LucideIconPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function LucideIconPicker({ value, onChange, disabled, className }: LucideIconPickerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-10 w-10 shrink-0 rounded-xl border border-border bg-surface flex items-center justify-center text-primary">
        <CategoryLucideIcon name={value} className="h-5 w-5" />
      </div>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70"
      >
        <option value="">Select icon...</option>
        {CATEGORY_ICON_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.value})
          </option>
        ))}
      </select>
    </div>
  );
}
