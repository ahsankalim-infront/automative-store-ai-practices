"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  RefreshCw, Search, ChevronLeft, ChevronRight, ScrollText, Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  ACTIVITY_CATEGORY_LABELS,
  type ActivityCategory,
  type ActivityLog,
  type ActivityStatus,
} from "@/lib/activity-log/types";
import toast from "react-hot-toast";

const PAGE_SIZE = 50;

const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  auth: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  order: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  contact: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  booking: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  newsletter: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  settings: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  media: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  system: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function formatLogTime(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function actorLabel(log: ActivityLog) {
  if (log.actorName) return log.actorName;
  if (log.actorEmail) return log.actorEmail;
  return "—";
}

export function ActivityLogsClient() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ActivityCategory | "">("");
  const [status, setStatus] = useState<ActivityStatus | "">("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const res = await api.adminActivityLogs({
      category: category || undefined,
      status: status || undefined,
      search: search || undefined,
      limit: PAGE_SIZE,
      offset,
    });
    if (res.success && res.data) {
      setLogs(res.data.items);
      setTotal(res.data.total);
    } else {
      toast.error(res.error || "Failed to load activity logs");
    }
    setLoading(false);
  }, [category, status, search, offset]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setCategory("");
    setStatus("");
    setSearch("");
    setSearchInput("");
    setOffset(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Activity Logs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Audit trail of sign-ins, orders, admin changes, contact submissions, and other site activity.
        </p>
      </div>

      <Card padding="md">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Message, email, action, entity…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value as ActivityCategory | ""); setOffset(0); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All categories</option>
                {(Object.keys(ACTIVITY_CATEGORY_LABELS) as ActivityCategory[]).map((key) => (
                  <option key={key} value={key}>{ACTIVITY_CATEGORY_LABELS[key]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value as ActivityStatus | ""); setOffset(0); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-end gap-2">
              <Button type="submit" variant="outline" size="sm" onClick={handleSearch} className="flex-1">
                Apply
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Filter className="h-3.5 w-3.5" />} onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${total.toLocaleString()} log${total === 1 ? "" : "s"}`}
            {!loading && total > 0 && (
              <span className="text-gray-400"> · page {currentPage} of {totalPages}</span>
            )}
          </p>
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={loadLogs} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading activity logs…</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No activity logs yet. Actions across the site will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm table-fixed">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left">
                  <th className="px-4 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Time</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-500">Category</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-500">Message</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-500">Actor</th>
                  <th className="px-4 py-2.5 font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const expanded = expandedId === log.id;
                  const hasDetails = Boolean(log.metadata || log.ip || log.path || log.entityType || log.userAgent);
                  return (
                    <Fragment key={log.id}>
                      <tr
                        key={log.id}
                        className={cn(
                          "hover:bg-muted/20 transition-colors",
                          hasDetails && "cursor-pointer"
                        )}
                        onClick={() => hasDetails && setExpandedId(expanded ? null : log.id)}
                      >
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap align-top">
                          {formatLogTime(log.createdAt)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className={cn("inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full", CATEGORY_COLORS[log.category])}>
                            {ACTIVITY_CATEGORY_LABELS[log.category]}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1 font-mono">{log.action}</p>
                        </td>
                        <td className="px-4 py-3 text-foreground align-top">
                          <p className="font-medium line-clamp-2 break-words">{log.message}</p>
                          {log.entityType && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {log.entityType}{log.entityId ? ` · ${log.entityId}` : ""}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top min-w-0">
                          <p className="text-foreground truncate max-w-[8rem] sm:max-w-none" title={actorLabel(log)}>{actorLabel(log)}</p>
                          {log.actorRole && (
                            <p className="text-xs text-gray-400 capitalize">{log.actorRole}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Badge variant={log.status === "success" ? "success" : "danger"}>
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                      {expanded && hasDetails && (
                        <tr className="bg-muted/10">
                          <td colSpan={5} className="px-4 py-3 text-xs text-gray-500 space-y-1">
                            {log.path && <p><span className="font-semibold text-gray-600 dark:text-gray-400">Path:</span> {log.path}</p>}
                            {log.ip && <p><span className="font-semibold text-gray-600 dark:text-gray-400">IP:</span> {log.ip}</p>}
                            {log.userAgent && (
                              <p className="break-all">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">User agent:</span> {log.userAgent}
                              </p>
                            )}
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <pre className="mt-2 p-2 rounded-lg bg-muted/50 overflow-x-auto text-[11px] font-mono">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > PAGE_SIZE && (
          <div className="px-4 py-3 border-t border-border flex flex-col xs:flex-row items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              disabled={offset === 0 || loading}
              onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            >
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </span>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="h-4 w-4" />}
              disabled={offset + PAGE_SIZE >= total || loading}
              onClick={() => setOffset(offset + PAGE_SIZE)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
