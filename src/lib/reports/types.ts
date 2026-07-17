export type ReportType =
  | "sales_summary"
  | "orders"
  | "top_products"
  | "products"
  | "customers"
  | "inventory"
  | "bookings"
  | "reviews"
  | "contacts";

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right";
}

export interface ReportSummaryItem {
  label: string;
  value: string;
}

export interface ReportResult {
  meta: {
    title: string;
    type: ReportType;
    generatedAt: string;
    dateFrom: string;
    dateTo: string;
    statusFilter?: string;
    rowCount: number;
    storeName: string;
    storeEmail: string;
    orderPrefix: string;
  };
  summary: ReportSummaryItem[];
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
}

export interface ReportQuery {
  type: ReportType;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export const REPORT_TYPE_OPTIONS: {
  id: ReportType;
  label: string;
  description: string;
  hasStatusFilter?: boolean;
}[] = [
  { id: "sales_summary", label: "Sales Summary", description: "Daily revenue and order counts" },
  { id: "orders", label: "Orders", description: "Order list with payment & delivery details", hasStatusFilter: true },
  { id: "top_products", label: "Top Products", description: "Best-selling products by revenue" },
  { id: "products", label: "Product Catalog", description: "All products with pricing and stock" },
  { id: "customers", label: "Customers", description: "Registered customer accounts" },
  { id: "inventory", label: "Inventory", description: "Stock levels and low-stock alerts" },
  { id: "bookings", label: "Service Bookings", description: "Appointments and service requests", hasStatusFilter: true },
  { id: "reviews", label: "Product Reviews", description: "Customer ratings and feedback" },
  { id: "contacts", label: "Contact Messages", description: "Website contact form submissions" },
];

export const ORDER_STATUS_OPTIONS = [
  "pending", "confirmed", "processing", "shipped", "out_for_delivery",
  "delivered", "cancelled", "returned", "refunded",
];

export const BOOKING_STATUS_OPTIONS = [
  "pending", "confirmed", "in_progress", "completed", "cancelled",
];

export const DATE_PRESETS = [
  { id: "today", label: "Today", days: 0 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "365d", label: "Last 12 months", days: 365 },
  { id: "all", label: "All time", days: -1 },
] as const;
