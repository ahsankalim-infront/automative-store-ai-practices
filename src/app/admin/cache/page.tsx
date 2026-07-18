"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";

interface CacheGroupView {
  id: string;
  label: string;
  description: string;
  tags: string[];
}

export default function AdminCachePage() {
  const [groups, setGroups] = useState<CacheGroupView[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.adminGetCacheGroups();
    if (res.success && res.data) {
      setGroups(res.data.groups);
    } else {
      toast.error(res.error || "Failed to load cache groups");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function clearAll() {
    if (!confirm("Clear all application caches? Storefront data will refresh on next visit.")) {
      return;
    }
    setBusy("all");
    const res = await api.adminClearCache("all");
    setBusy(null);
    if (res.success) {
      toast.success(`Cleared ${res.data?.clearedTags?.length ?? 0} cache tags`);
    } else {
      toast.error(res.error || "Failed to clear cache");
    }
  }

  async function clearGroup(id: string, label: string) {
    if (!confirm(`Clear “${label}” cache?`)) return;
    setBusy(id);
    const res = await api.adminClearCache(id);
    setBusy(null);
    if (res.success) {
      toast.success(`Cleared ${label} (${res.data?.clearedTags?.length ?? 0} tags)`);
    } else {
      toast.error(res.error || "Failed to clear cache");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="h-6 w-6 text-[var(--brand-primary)]" />
            Cache
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Clear Next.js data caches so the storefront picks up the latest catalog, content, and
            settings immediately.
          </p>
        </div>
        <Button
          onClick={clearAll}
          disabled={busy !== null}
          className="bg-[var(--brand-primary)] hover:opacity-90"
        >
          {busy === "all" ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Clear all cache
        </Button>
      </div>

      <Card className="p-4 border-amber-200 bg-amber-50/60">
        <p className="text-sm text-amber-900">
          Use <strong>Clear all</strong> after bulk imports or MySQL/JSON switches. Use a section
          button when you only changed that area (e.g. categories or SEO).
        </p>
      </Card>

      {loading ? (
        <p className="text-sm text-gray-500">Loading cache groups…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id} className="p-5 flex flex-col gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">{group.label}</h2>
                <p className="mt-1 text-sm text-gray-500">{group.description}</p>
                <p className="mt-2 text-[11px] text-gray-400 font-mono break-all">
                  {group.tags.join(", ")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-auto w-full"
                disabled={busy !== null}
                onClick={() => clearGroup(group.id, group.label)}
              >
                {busy === group.id ? (
                  <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                )}
                Clear {group.label}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
