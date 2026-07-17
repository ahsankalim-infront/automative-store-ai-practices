"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3, Download, FileSpreadsheet, FileText, Filter,
  RefreshCw, Calendar, ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { cn, formatPrice } from "@/lib/utils";
import { useBrand } from "@/lib/brand/brand-context";
import {
  REPORT_TYPE_OPTIONS,
  ORDER_STATUS_OPTIONS,
  BOOKING_STATUS_OPTIONS,
  DATE_PRESETS,
  type ReportType,
  type ReportResult,
} from "@/lib/reports/types";
import { downloadReportExcel, downloadReportPdf } from "@/lib/reports/export";
import toast from "react-hot-toast";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function presetRange(days: number): { from: string; to: string } {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  if (days < 0) {
    const from = new Date(2020, 0, 1);
    from.setHours(0, 0, 0, 0);
    return { from: toDatetimeLocal(from), to: toDatetimeLocal(to) };
  }
  const from = new Date();
  if (days === 0) {
    from.setHours(0, 0, 0, 0);
  } else {
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);
  }
  return { from: toDatetimeLocal(from), to: toDatetimeLocal(to) };
}

function formatCellValue(value: string | number | undefined, key: string): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "number" && /revenue|total|price|value|subtotal|shipping|discount|avgOrder/i.test(key)) {
    return formatPrice(value);
  }
  return String(value);
}

export default function AdminReportsPage() {
  const brand = useBrand();
  const defaultRange = useMemo(() => presetRange(30), []);
  const [reportType, setReportType] = useState<ReportType>("sales_summary");
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [status, setStatus] = useState("");
  const [activePreset, setActivePreset] = useState("30d");
  const [report, setReport] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const typeConfig = REPORT_TYPE_OPTIONS.find((t) => t.id === reportType)!;
  const showStatus = typeConfig.hasStatusFilter;
  const statusOptions = reportType === "bookings" ? BOOKING_STATUS_OPTIONS : ORDER_STATUS_OPTIONS;

  const loadReport = useCallback(async () => {
    setLoading(true);
    const res = await api.adminReport({
      type: reportType,
      dateFrom,
      dateTo,
      status: status || undefined,
    });
    if (res.success && res.data) {
      setReport(res.data);
    } else {
      toast.error(res.error || "Failed to load report");
      setReport(null);
    }
    setLoading(false);
  }, [reportType, dateFrom, dateTo, status]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const applyPreset = (presetId: string, days: number) => {
    const range = presetRange(days);
    setDateFrom(range.from);
    setDateTo(range.to);
    setActivePreset(presetId);
  };

  const handleExportExcel = async () => {
    if (!report) return;
    setExporting("excel");
    try {
      await downloadReportExcel(report);
      toast.success("Excel file downloaded");
    } catch {
      toast.error("Excel export failed");
    }
    setExporting(null);
  };

  const handleExportPdf = async () => {
    if (!report) return;
    setExporting("pdf");
    try {
      await downloadReportPdf(report);
      toast.success("PDF file downloaded");
    } catch {
      toast.error("PDF export failed");
    }
    setExporting(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-br from-secondary via-gray-900 to-secondary border border-white/10 p-5 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-primary shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Business Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">Reports</h1>
            <p className="text-sm text-gray-400 mt-1">
              {brand.name} — filter by date, type & status, then download Excel or PDF
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
              onClick={handleExportExcel}
              loading={exporting === "excel"}
              disabled={!report?.rows.length || loading}
            >
              Download Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={handleExportPdf}
              loading={exporting === "pdf"}
              disabled={!report?.rows.length || loading}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Report filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="sm:col-span-2 xl:col-span-1">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Report type</label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value as ReportType);
                  setStatus("");
                }}
                className="w-full appearance-none px-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              >
                {REPORT_TYPE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{typeConfig.description}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">From (date & time)</label>
            <input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setActivePreset("custom"); }}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">To (date & time)</label>
            <input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setActivePreset("custom"); }}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {showStatus && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Status filter</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            Quick range:
          </div>
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id, p.days)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  activePreset === p.id
                    ? "bg-primary text-white"
                    : "bg-surface text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {p.label}
              </button>
            ))}
            {activePreset === "custom" && (
              <span className="px-3 py-1.5 text-xs text-gray-400">Custom range</span>
            )}
          </div>
          <Button
            size="sm"
            className="sm:ml-auto shrink-0"
            leftIcon={<RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />}
            onClick={loadReport}
            loading={loading}
          >
            Generate report
          </Button>
        </div>
      </Card>

      {/* Summary KPIs */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {report.summary.map((s) => (
            <Card key={s.label} padding="md" className="min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">{s.label}</p>
              <p className="text-lg sm:text-xl font-black text-primary mt-1 truncate" title={s.value}>
                {s.value}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Data table */}
      <Card padding="none">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">
              {report?.meta.title ?? "Report preview"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? "Loading…" : `${report?.meta.rowCount ?? 0} records`}
              {report?.meta.generatedAt && !loading && (
                <> · Generated {new Date(report.meta.generatedAt).toLocaleString("en-PK")}</>
              )}
            </p>
          </div>
          <div className="flex gap-2 sm:hidden">
            <Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={handleExportExcel} disabled={!report?.rows.length}>
              Excel
            </Button>
            <Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={handleExportPdf} disabled={!report?.rows.length}>
              PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Generating report…</div>
        ) : !report?.rows.length ? (
          <div className="p-12 text-center">
            <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No data for the selected filters</p>
            <p className="text-xs text-gray-400 mt-1">Try a wider date range or different report type</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-surface">
                <tr>
                  {report.columns.map((col) => (
                    <th
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-surface">
                    {report.columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-foreground max-w-xs",
                          col.align === "right" ? "text-right tabular-nums" : "text-left",
                          col.key === "message" || col.key === "review" ? "truncate" : ""
                        )}
                        title={String(row[col.key] ?? "")}
                      >
                        {formatCellValue(row[col.key], col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
