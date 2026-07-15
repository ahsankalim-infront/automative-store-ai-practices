import type { OrderStatus } from "@/types";

export const ORDER_STATUS_CHART_COLORS: Record<OrderStatus, string> = {
  pending: "#6B7280",
  confirmed: "#3B82F6",
  processing: "#D97706",
  shipped: "#2563EB",
  out_for_delivery: "#0EA5E9",
  delivered: "#16A34A",
  cancelled: "#D50000",
  returned: "#9333EA",
  refunded: "#F59E0B",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  processing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  out_for_delivery: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  returned: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
};

const FALLBACK_BADGE =
  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

export function formatOrderStatusLabel(status: string, uppercase = false): string {
  const label = status.replace(/_/g, " ");
  return uppercase ? label.toUpperCase() : label.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getOrderStatusBadgeClasses(status: string): string {
  return ORDER_STATUS_BADGE_CLASSES[status as OrderStatus] ?? FALLBACK_BADGE;
}
