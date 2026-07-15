import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminPlaceholderProps {
  title: string;
  description?: string;
  count?: number | string;
  icon?: LucideIcon;
  addLabel?: string;
}

export function AdminPlaceholder({ title, description, count, icon: Icon, addLabel }: AdminPlaceholderProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">{title}</h1>
          {count !== undefined && <p className="text-sm text-gray-500">{count} total records</p>}
        </div>
        {addLabel && <Button leftIcon={<Plus className="h-4 w-4" />}>{addLabel}</Button>}
      </div>
      <div className="bg-card rounded-2xl border border-border p-12 text-center">
        {Icon && <Icon className="h-12 w-12 text-gray-200 mx-auto mb-4" />}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title} Module</h3>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          {description || `Manage your ${title.toLowerCase()} from this section. Full CRUD interface with filters and bulk actions.`}
        </p>
        <div className="mt-6 flex justify-center gap-3 text-xs text-gray-300 dark:text-gray-600">
          <span className="px-3 py-1 bg-surface rounded-full">REST API Ready</span>
          <span className="px-3 py-1 bg-surface rounded-full">TypeScript Typed</span>
          <span className="px-3 py-1 bg-surface rounded-full">Bulk Actions</span>
        </div>
      </div>
    </div>
  );
}
