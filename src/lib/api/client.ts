"use client";

import type { User } from "@/types";
import { clearAuthStorage } from "@/lib/auth/session";

const BASE = "/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  }

  setToken(token: string | null) {
    if (typeof window === "undefined") return;
    if (token) localStorage.setItem("auth_token", token);
    else clearAuthStorage();
  }

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: "include" });
    const json = (await res.json()) as ApiResponse<T>;
    return json;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body) });
  }

  put<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "PUT", body: JSON.stringify(body) });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }

  // ─── Auth ──────────────────────────────────────────────────────────────────
  login(email: string, password: string) {
    return this.post<{ user: User; token: string }>("/auth/login", { email, password });
  }

  adminLogin(email: string, password: string) {
    return this.post<{ user: User; token: string }>("/auth/admin/login", { email, password });
  }

  register(data: { name: string; email: string; phone?: string; password: string }) {
    return this.post<{ user: User; token: string }>("/auth/register", data);
  }

  me() {
    return this.get<User>("/auth/me");
  }

  logout() {
    return this.post<{ message: string }>("/auth/logout", {});
  }

  // ─── Catalog ───────────────────────────────────────────────────────────────
  products(params?: Record<string, string>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.get<import("@/types").Product[]>(`/products${qs}`);
  }

  product(slug: string) {
    return this.get<import("@/types").Product>(`/products/${slug}`);
  }

  categories() {
    return this.get<import("@/types").Category[]>("/categories");
  }

  brands() {
    return this.get<import("@/types").Brand[]>("/brands");
  }

  vehicles() {
    return this.get<import("@/types").VehicleMake[]>("/vehicles");
  }

  services() {
    return this.get<import("@/types").Service[]>("/services");
  }

  stores() {
    return this.get<import("@/types").Store[]>("/stores");
  }

  blogs() {
    return this.get<import("@/types").BlogPost[]>("/blogs");
  }

  banners(position?: string) {
    const qs = position ? `?position=${position}` : "";
    return this.get<import("@/types").Banner[]>(`/banners${qs}`);
  }

  reviews(productId?: string) {
    const qs = productId ? `?productId=${productId}` : "";
    return this.get<import("@/types").Review[]>(`/reviews${qs}`);
  }

  validateCoupon(code: string, subtotal: number) {
    return this.post<{ valid: boolean; discount?: number; message?: string }>(
      "/coupons/validate",
      { code, subtotal }
    );
  }

  // ─── Orders & Bookings ─────────────────────────────────────────────────────
  orders() {
    return this.get<import("@/types").Order[]>("/orders");
  }

  createOrder(data: unknown) {
    return this.post<import("@/types").Order>("/orders", data);
  }

  bookings() {
    return this.get<import("@/types").ServiceBooking[]>("/bookings");
  }

  createBooking(data: unknown) {
    return this.post<import("@/types").ServiceBooking>("/bookings", data);
  }

  contact(data: { name: string; email?: string; phone: string; subject: string; message: string }) {
    return this.post<{ id: string }>("/contact", data);
  }

  newsletter(email: string) {
    return this.post<{ id: string }>("/newsletter", { email });
  }

  updateProfile(data: Partial<User>) {
    return this.patch<User>("/users/me", data);
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────
  adminStats(period?: string) {
    const qs = period ? `?period=${period}` : "";
    return this.get<import("@/types").AdminDashboardData>(`/admin/stats${qs}`);
  }

  adminReport(params: {
    type: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }) {
    const qs = new URLSearchParams({ type: params.type });
    if (params.dateFrom) qs.set("dateFrom", params.dateFrom);
    if (params.dateTo) qs.set("dateTo", params.dateTo);
    if (params.status) qs.set("status", params.status);
    return this.get<import("@/lib/reports/types").ReportResult>(`/admin/reports?${qs}`);
  }

  adminNavCounts() {
    return this.get<import("@/types").AdminNavCounts>("/admin/nav-counts");
  }

  adminProducts() {
    return this.get<import("@/types").Product[]>("/admin/products");
  }

  adminCreateProduct(data: import("@/types").Product) {
    return this.post<import("@/types").Product>("/admin/products", data);
  }

  adminUpdateProduct(id: string, data: Partial<import("@/types").Product>) {
    return this.put<import("@/types").Product>(`/admin/products/${id}`, data);
  }

  adminDeleteProduct(id: string) {
    return this.delete<{ deleted: boolean }>(`/admin/products/${id}`);
  }

  adminOrders() {
    return this.get<import("@/types").Order[]>("/admin/orders");
  }

  adminUpdateOrder(id: string, data: Partial<import("@/types").Order>) {
    return this.patch<import("@/types").Order>(`/admin/orders/${id}`, data);
  }

  adminCustomers() {
    return this.get<import("@/types").User[]>("/admin/customers");
  }

  getPushVapidKey() {
    return this.get<{ publicKey: string; configured: boolean }>("/admin/push/vapid");
  }

  getPushSubscriptions() {
    return this.get<Array<{ id: string; userId: string; userEmail: string; deviceLabel?: string; createdAt: string }>>(
      "/admin/push/subscriptions"
    );
  }

  subscribePush(data: { endpoint: string; keys: { p256dh: string; auth: string }; deviceLabel?: string }) {
    return this.post<{ id: string; subscribed: boolean }>("/admin/push/subscribe", data);
  }

  unsubscribePush(endpoint: string) {
    return this.post<{ unsubscribed: boolean }>("/admin/push/unsubscribe", { endpoint });
  }

  testPush() {
    return this.post<{ sent: boolean }>("/admin/push/test", {});
  }

  getNotifications() {
    return this.get<{ notifications: import("@/types").AppNotification[]; unreadCount: number }>("/notifications");
  }

  getAdminNotificationInbox() {
    return this.get<{ notifications: import("@/types").AppNotification[]; unreadCount: number }>("/admin/notifications/list");
  }

  markNotificationRead(id: string) {
    return this.patch<{ read: boolean }>(`/notifications/${id}`, {});
  }

  markAllNotificationsRead() {
    return this.patch<{ marked: number }>("/notifications", { markAllRead: true });
  }

  // ─── Admin CRUD (generic resources) ────────────────────────────────────────
  adminList(resource: string) {
    return this.get<Record<string, unknown>[]>(`/admin/resources/${resource}`);
  }

  adminGet(resource: string, id: string) {
    return this.get<Record<string, unknown>>(`/admin/resources/${resource}/${id}`);
  }

  adminCreate(resource: string, data: unknown) {
    return this.post<Record<string, unknown>>(`/admin/resources/${resource}`, data);
  }

  adminUpdate(resource: string, id: string, data: unknown) {
    return this.put<Record<string, unknown>>(`/admin/resources/${resource}/${id}`, data);
  }

  adminDelete(resource: string, id: string) {
    return this.delete<{ deleted: boolean }>(`/admin/resources/${resource}/${id}`);
  }

  adminGetSettings() {
    return this.get<Record<string, unknown>>("/admin/settings");
  }

  adminUpdateSettings(data: unknown) {
    return this.put<Record<string, unknown>>("/admin/settings", data);
  }

  adminGetSeo() {
    return this.get<import("@/lib/seo/types").SeoConfig>("/admin/seo");
  }

  adminUpdateSeo(data: unknown) {
    return this.put<import("@/lib/seo/types").SeoConfig>("/admin/seo", data);
  }

  adminGetHomeLayout() {
    return this.get<import("@/lib/home-layout/types").HomeLayoutConfig>("/admin/home-layout");
  }

  adminUpdateHomeLayout(data: unknown) {
    return this.put<import("@/lib/home-layout/types").HomeLayoutConfig>("/admin/home-layout", data);
  }

  // ─── Admin file uploads ────────────────────────────────────────────────────
  adminListFiles() {
    return this.get<import("@/types").UploadedFile[]>("/admin/files");
  }

  async adminUploadFile(formData: FormData) {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE}/admin/files`, {
      method: "POST",
      body: formData,
      headers,
      credentials: "include",
    });
    return (await res.json()) as ApiResponse<import("@/types").UploadedFile>;
  }

  adminDeleteFile(id: string) {
    return this.delete<{ deleted: boolean }>(`/admin/files/${id}`);
  }
}

export const api = new ApiClient();
