import {
  getOrders,
  getProducts,
  getUsers,
  getBookings,
  getReviews,
  getContactMessages,
} from "@/lib/data/repositories";
import { formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/brand/config";
import type { ReportQuery, ReportResult, ReportType } from "./types";

function parseRange(dateFrom?: string, dateTo?: string): { from: Date | null; to: Date | null } {
  const from = dateFrom ? new Date(dateFrom) : null;
  const to = dateTo ? new Date(dateTo) : null;
  if (to && dateTo && !dateTo.includes("T")) {
    to.setHours(23, 59, 59, 999);
  }
  return { from, to };
}

function inRange(iso: string, from: Date | null, to: Date | null): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function titleFor(type: ReportType): string {
  const map: Record<ReportType, string> = {
    sales_summary: "Sales Summary Report",
    orders: "Orders Report",
    top_products: "Top Products Report",
    products: "Product Catalog Report",
    customers: "Customers Report",
    inventory: "Inventory Report",
    bookings: "Service Bookings Report",
    reviews: "Product Reviews Report",
    contacts: "Contact Messages Report",
  };
  return map[type];
}

export async function generateAdminReport(query: ReportQuery): Promise<ReportResult> {
  const { type, dateFrom, dateTo, status } = query;
  const { from, to } = parseRange(dateFrom, dateTo);
  const generatedAt = new Date().toISOString();

  const baseMeta = {
    type,
    title: titleFor(type),
    generatedAt,
    dateFrom: dateFrom || "—",
    dateTo: dateTo || "—",
    statusFilter: status || undefined,
    rowCount: 0,
  };

  switch (type) {
    case "sales_summary":
      return buildSalesSummary(baseMeta, from, to);
    case "orders":
      return buildOrdersReport(baseMeta, from, to, status);
    case "top_products":
      return buildTopProductsReport(baseMeta, from, to);
    case "products":
      return buildProductsReport(baseMeta);
    case "customers":
      return buildCustomersReport(baseMeta, from, to);
    case "inventory":
      return buildInventoryReport(baseMeta);
    case "bookings":
      return buildBookingsReport(baseMeta, from, to, status);
    case "reviews":
      return buildReviewsReport(baseMeta, from, to);
    case "contacts":
      return buildContactsReport(baseMeta, from, to);
    default:
      throw new Error("Unknown report type");
  }
}

async function buildSalesSummary(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null
): Promise<ReportResult> {
  const orders = (await getOrders()).filter((o) => inRange(o.createdAt, from, to));
  const dayMap = new Map<string, { orders: number; revenue: number; sort: number }>();

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = d.toLocaleDateString("en-CA");
    const label = fmtDate(o.createdAt);
    const cur = dayMap.get(key) || { orders: 0, revenue: 0, sort: d.getTime() };
    cur.orders += 1;
    cur.revenue += o.total;
    dayMap.set(key, cur);
  }

  const rows = Array.from(dayMap.entries())
    .sort((a, b) => a[1].sort - b[1].sort)
    .map(([key, v]) => ({
      date: fmtDate(key),
      orders: v.orders,
      revenue: v.revenue,
      avgOrder: v.orders ? Math.round(v.revenue / v.orders) : 0,
    }));

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Total Revenue", value: formatPrice(totalRevenue) },
      { label: "Total Orders", value: String(orders.length) },
      { label: "Avg Order Value", value: formatPrice(orders.length ? Math.round(totalRevenue / orders.length) : 0) },
      { label: "Report Period", value: `${meta.dateFrom} → ${meta.dateTo}` },
    ],
    columns: [
      { key: "date", label: "Date" },
      { key: "orders", label: "Orders", align: "right" },
      { key: "revenue", label: "Revenue (PKR)", align: "right" },
      { key: "avgOrder", label: "Avg Order (PKR)", align: "right" },
    ],
    rows,
  };
}

async function buildOrdersReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null,
  status?: string
): Promise<ReportResult> {
  let orders = (await getOrders()).filter((o) => inRange(o.createdAt, from, to));
  if (status) orders = orders.filter((o) => o.status === status);
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rows = orders.map((o) => ({
    orderNumber: o.orderNumber,
    date: fmtDateTime(o.createdAt),
    customer: o.shippingAddress.fullName,
    phone: o.shippingAddress.phone,
    city: o.shippingAddress.city,
    items: o.items.reduce((s, i) => s + i.quantity, 0),
    subtotal: o.subtotal,
    shipping: o.shippingCost,
    discount: o.discount,
    total: o.total,
    status: o.status.replace(/_/g, " "),
    payment: o.paymentMethod,
    paymentStatus: o.paymentStatus,
  }));

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Orders", value: String(orders.length) },
      { label: "Total Revenue", value: formatPrice(totalRevenue) },
      { label: "Status Filter", value: status ? status.replace(/_/g, " ") : "All" },
      { label: "Store", value: BRAND.name },
    ],
    columns: [
      { key: "orderNumber", label: "Order #" },
      { key: "date", label: "Date & Time" },
      { key: "customer", label: "Customer" },
      { key: "phone", label: "Phone" },
      { key: "city", label: "City" },
      { key: "items", label: "Items", align: "right" },
      { key: "total", label: "Total (PKR)", align: "right" },
      { key: "status", label: "Status" },
      { key: "payment", label: "Payment" },
    ],
    rows,
  };
}

async function buildTopProductsReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null
): Promise<ReportResult> {
  const orders = (await getOrders()).filter((o) => inRange(o.createdAt, from, to));
  const map = new Map<string, { name: string; sku: string; qty: number; revenue: number }>();

  for (const o of orders) {
    for (const item of o.items) {
      const cur = map.get(item.productId) || {
        name: item.productName,
        sku: item.sku,
        qty: 0,
        revenue: 0,
      };
      cur.qty += item.quantity;
      cur.revenue += item.price * item.quantity;
      map.set(item.productId, cur);
    }
  }

  const rows = Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .map((p, i) => ({
      rank: i + 1,
      product: p.name,
      sku: p.sku,
      unitsSold: p.qty,
      revenue: p.revenue,
    }));

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Products Sold", value: String(rows.length) },
      { label: "Units Sold", value: String(rows.reduce((s, r) => s + Number(r.unitsSold), 0)) },
      { label: "Total Revenue", value: formatPrice(rows.reduce((s, r) => s + Number(r.revenue), 0)) },
      { label: "Period", value: `${meta.dateFrom} → ${meta.dateTo}` },
    ],
    columns: [
      { key: "rank", label: "#", align: "right" },
      { key: "product", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "unitsSold", label: "Units Sold", align: "right" },
      { key: "revenue", label: "Revenue (PKR)", align: "right" },
    ],
    rows,
  };
}

async function buildProductsReport(meta: ReportResult["meta"]): Promise<ReportResult> {
  const products = await getProducts();
  const rows = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    brand: p.brand,
    category: p.category,
    price: p.price,
    stock: p.stock,
    inStock: p.inStock ? "Yes" : "No",
    rating: p.rating,
    reviews: p.reviewCount,
  }));

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Total Products", value: String(products.length) },
      { label: "In Stock", value: String(products.filter((p) => p.inStock).length) },
      { label: "Low Stock (<10)", value: String(products.filter((p) => p.stock < 10).length) },
      { label: "Out of Stock", value: String(products.filter((p) => !p.inStock).length) },
    ],
    columns: [
      { key: "name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "brand", label: "Brand" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price (PKR)", align: "right" },
      { key: "stock", label: "Stock", align: "right" },
      { key: "inStock", label: "Available" },
      { key: "rating", label: "Rating", align: "right" },
    ],
    rows,
  };
}

async function buildCustomersReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null
): Promise<ReportResult> {
  const users = (await getUsers("customer")).filter((u) => inRange(u.createdAt, from, to));
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rows = users.map((u) => ({
    name: u.name,
    email: u.email,
    phone: u.phone || "—",
    registered: fmtDateTime(u.createdAt),
    verified: u.isVerified ? "Yes" : "No",
    loyaltyPoints: u.loyaltyPoints ?? 0,
  }));

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "New Customers", value: String(users.length) },
      { label: "Verified", value: String(users.filter((u) => u.isVerified).length) },
      { label: "Period", value: `${meta.dateFrom} → ${meta.dateTo}` },
      { label: "Store", value: BRAND.name },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "registered", label: "Registered" },
      { key: "verified", label: "Verified" },
      { key: "loyaltyPoints", label: "Points", align: "right" },
    ],
    rows,
  };
}

async function buildInventoryReport(meta: ReportResult["meta"]): Promise<ReportResult> {
  const products = await getProducts().then((p) => [...p].sort((a, b) => a.stock - b.stock));
  const rows = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    category: p.category,
    stock: p.stock,
    status: p.stock === 0 ? "Out of stock" : p.stock < 10 ? "Low stock" : "In stock",
    price: p.price,
    value: p.price * p.stock,
  }));

  const lowStock = products.filter((p) => p.stock < 10).length;

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "SKUs", value: String(products.length) },
      { label: "Low / Out of Stock", value: String(lowStock) },
      { label: "Total Stock Value", value: formatPrice(rows.reduce((s, r) => s + Number(r.value), 0)) },
      { label: "Generated", value: fmtDateTime(meta.generatedAt) },
    ],
    columns: [
      { key: "name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "stock", label: "Stock", align: "right" },
      { key: "status", label: "Status" },
      { key: "price", label: "Unit Price", align: "right" },
      { key: "value", label: "Stock Value", align: "right" },
    ],
    rows,
  };
}

async function buildBookingsReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null,
  status?: string
): Promise<ReportResult> {
  let bookings = (await getBookings()).filter((b) => inRange(b.createdAt, from, to));
  if (status) bookings = bookings.filter((b) => b.status === status);
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rows = bookings.map((b) => ({
    service: b.serviceName,
    customer: b.userName,
    phone: b.userPhone,
    branch: b.branchName,
    appointmentDate: b.date,
    timeSlot: b.timeSlot,
    vehicle: b.vehicleInfo || "—",
    price: b.price ?? 0,
    status: b.status.replace(/_/g, " "),
    bookedAt: fmtDateTime(b.createdAt),
  }));

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Bookings", value: String(bookings.length) },
      { label: "Pending", value: String(bookings.filter((b) => b.status === "pending").length) },
      { label: "Status Filter", value: status ? status.replace(/_/g, " ") : "All" },
      { label: "Est. Value", value: formatPrice(bookings.reduce((s, b) => s + (b.price ?? 0), 0)) },
    ],
    columns: [
      { key: "service", label: "Service" },
      { key: "customer", label: "Customer" },
      { key: "phone", label: "Phone" },
      { key: "branch", label: "Branch" },
      { key: "appointmentDate", label: "Appt. Date" },
      { key: "timeSlot", label: "Time" },
      { key: "price", label: "Price (PKR)", align: "right" },
      { key: "status", label: "Status" },
      { key: "bookedAt", label: "Booked At" },
    ],
    rows,
  };
}

async function buildReviewsReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null
): Promise<ReportResult> {
  const reviews = (await getReviews()).filter((r) => inRange(r.createdAt, from, to));
  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rows = reviews.map((r) => ({
    productId: r.productId,
    customer: r.userName,
    rating: r.rating,
    title: r.title,
    review: r.body.slice(0, 120) + (r.body.length > 120 ? "…" : ""),
    verified: r.isVerifiedPurchase ? "Yes" : "No",
    helpful: r.helpfulCount,
    date: fmtDateTime(r.createdAt),
  }));

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Reviews", value: String(reviews.length) },
      { label: "Average Rating", value: `${avg} ★` },
      { label: "Verified Purchases", value: String(reviews.filter((r) => r.isVerifiedPurchase).length) },
      { label: "Period", value: `${meta.dateFrom} → ${meta.dateTo}` },
    ],
    columns: [
      { key: "customer", label: "Customer" },
      { key: "rating", label: "Rating", align: "right" },
      { key: "title", label: "Title" },
      { key: "review", label: "Review" },
      { key: "verified", label: "Verified" },
      { key: "date", label: "Date" },
    ],
    rows,
  };
}

async function buildContactsReport(
  meta: ReportResult["meta"],
  from: Date | null,
  to: Date | null
): Promise<ReportResult> {
  const messages = (await getContactMessages()).filter((m) => inRange(m.createdAt, from, to));
  messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const rows = messages.map((m) => ({
    name: m.name,
    phone: m.phone || "—",
    email: m.email || "—",
    subject: m.subject,
    message: m.message.slice(0, 100) + (m.message.length > 100 ? "…" : ""),
    received: fmtDateTime(m.createdAt),
  }));

  return {
    meta: { ...meta, rowCount: rows.length },
    summary: [
      { label: "Messages", value: String(messages.length) },
      { label: "Period", value: `${meta.dateFrom} → ${meta.dateTo}` },
      { label: "Store Email", value: BRAND.email },
      { label: "Generated", value: fmtDateTime(meta.generatedAt) },
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "subject", label: "Subject" },
      { key: "message", label: "Message" },
      { key: "received", label: "Received" },
    ],
    rows,
  };
}

export function isValidReportType(value: string): value is ReportType {
  return [
    "sales_summary", "orders", "top_products", "products", "customers",
    "inventory", "bookings", "reviews", "contacts",
  ].includes(value);
}
