import type {
  Product,
  Category,
  Brand,
  VehicleMake,
  BlogPost,
  Service,
  Store,
  Order,
  Review,
  Coupon,
  Banner,
  ServiceBooking,
  User,
  UserRole,
  OrderStatusBreakdown,
  TopProduct,
  SalesDataPoint,
  DashboardStats,
  AdminNavCounts,
  AppNotification,
} from "@/types";
import { getStore } from "../store";
import type { ProductFilters } from "../types";
import {
  readAllProducts,
  readAllCategories,
  readAllBrands,
  readAllVehicleMakes,
  readAllBlogPosts,
  readAllServices,
  readAllStores,
  readAllBanners,
} from "../cached-reads";
import { ORDER_STATUS_CHART_COLORS } from "@/lib/order-status";
import {
  syncProductRelations,
  deleteProductRelations,
  mergeProductRelations,
} from "../mysql/product-relations";
import {
  attachReviewStatsToProduct,
  attachReviewStatsToProducts,
} from "@/lib/products/review-stats";
import { applyCatalogFilters } from "@/lib/products/catalog-filters";
import { phonesMatch, isUndeliveredOrderStatus } from "@/lib/help/order-tracking";

export type { CatalogQuery } from "@/lib/products/catalog-filters";

const COL = {
  products: "products",
  categories: "categories",
  brands: "brands",
  vehicleMakes: "vehicle-makes",
  blogs: "blogs",
  services: "services",
  stores: "stores",
  orders: "orders",
  reviews: "reviews",
  users: "users",
  coupons: "coupons",
  banners: "banners",
  bookings: "bookings",
  contactMessages: "contact-messages",
  newsletter: "newsletter-subscribers",
  analytics: "analytics",
  pushSubscriptions: "push-subscriptions",
  notifications: "notifications",
} as const;

export interface PushSubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
  deviceLabel?: string;
  createdAt: string;
}

export interface UserRecord extends User {
  passwordHash: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface AnalyticsData {
  salesData: { date: string; revenue: number; orders: number }[];
  topProducts: { id: string; name: string; image: string; sales: number; revenue: number }[];
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let items = await readAllProducts();
  const allReviews = await getStore().read<Review>(COL.reviews);
  items = attachReviewStatsToProducts(items, allReviews);

  if (filters.slug) return items.filter((p) => p.slug === filters.slug);

  items = applyCatalogFilters(items, {
    category: filters.category,
    brand: filters.brand,
    q: filters.search,
    make: filters.make,
    model: filters.model,
    year: filters.year,
  });

  if (filters.featured) items = items.filter((p) => p.isFeatured);
  if (filters.bestseller) items = items.filter((p) => p.isBestSeller);
  if (filters.isNew) items = items.filter((p) => p.isNew);
  if (filters.flashSale) items = items.filter((p) => p.isFlashSale);
  if (filters.limit && filters.limit > 0) items = items.slice(0, filters.limit);
  return items;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const items = await getProducts({ slug });
  const product = items[0] ?? null;
  return product ? mergeProductRelations(product) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await getStore().readOne<Product>(COL.products, id);
  if (!product) return null;
  const reviews = await getReviews(product.id);
  const withStats = attachReviewStatsToProduct(product, reviews);
  return mergeProductRelations(withStats);
}

export async function createProduct(product: Product): Promise<Product> {
  const created = await getStore().create(COL.products, product);
  await syncProductRelations(created);
  return created;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const updated = await getStore().update(COL.products, id, { ...data, updatedAt: new Date().toISOString() });
  if (updated) await syncProductRelations(updated);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.products, id);
  if (deleted) await deleteProductRelations(id);
  return deleted;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const [categories, products] = await Promise.all([readAllCategories(), readAllProducts()]);
  return categories
    .map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categorySlug === cat.slug).length,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return getStore().readOne<Category>(COL.categories, id);
}

export async function createCategory(category: Category): Promise<Category> {
  return getStore().create(COL.categories, category);
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  return getStore().update(COL.categories, id, data);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return getStore().delete(COL.categories, id);
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  return readAllBrands();
}

export async function createBrand(brand: Brand): Promise<Brand> {
  return getStore().create(COL.brands, brand);
}

export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null> {
  return getStore().update(COL.brands, id, data);
}

export async function deleteBrand(id: string): Promise<boolean> {
  return getStore().delete(COL.brands, id);
}

export async function getBrandById(id: string): Promise<Brand | null> {
  return getStore().readOne<Brand>(COL.brands, id);
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export async function getVehicleMakes(): Promise<VehicleMake[]> {
  return readAllVehicleMakes();
}

export async function updateVehicleMakes(makes: VehicleMake[]): Promise<void> {
  return getStore().write(COL.vehicleMakes, makes);
}

export async function getVehicleMakeById(id: string): Promise<VehicleMake | null> {
  return getStore().readOne<VehicleMake>(COL.vehicleMakes, id);
}

export async function createVehicleMake(make: VehicleMake): Promise<VehicleMake> {
  return getStore().create(COL.vehicleMakes, make);
}

export async function updateVehicleMake(id: string, data: Partial<VehicleMake>): Promise<VehicleMake | null> {
  return getStore().update(COL.vehicleMakes, id, data);
}

export async function deleteVehicleMake(id: string): Promise<boolean> {
  return getStore().delete(COL.vehicleMakes, id);
}

// ─── Blogs ───────────────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  return readAllBlogPosts();
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  return getStore().readOne<BlogPost>(COL.blogs, id);
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function createBlogPost(post: BlogPost): Promise<BlogPost> {
  return getStore().create(COL.blogs, post);
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  return getStore().update(COL.blogs, id, data);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  return getStore().delete(COL.blogs, id);
}

// ─── Services & Stores ───────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  return readAllServices();
}

export async function getStores(): Promise<Store[]> {
  return readAllStores();
}

export async function createService(service: Service): Promise<Service> {
  return getStore().create(COL.services, service);
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  return getStore().update(COL.services, id, data);
}

export async function getServiceById(id: string): Promise<Service | null> {
  return getStore().readOne<Service>(COL.services, id);
}

export async function deleteService(id: string): Promise<boolean> {
  return getStore().delete(COL.services, id);
}

export async function createStore(store: Store): Promise<Store> {
  return getStore().create(COL.stores, store);
}

export async function updateStore(id: string, data: Partial<Store>): Promise<Store | null> {
  return getStore().update(COL.stores, id, data);
}

export async function getStoreById(id: string): Promise<Store | null> {
  return getStore().readOne<Store>(COL.stores, id);
}

export async function deleteStore(id: string): Promise<boolean> {
  return getStore().delete(COL.stores, id);
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function getOrders(userId?: string): Promise<Order[]> {
  const orders = await getStore().read<Order>(COL.orders);
  if (userId) return orders.filter((o) => o.userId === userId);
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  return getStore().readOne<Order>(COL.orders, id);
}

export async function trackOrders(
  phone?: string,
  orderNumber?: string
): Promise<Order[]> {
  const orders = await getStore().read<Order>(COL.orders);
  const trimmedNumber = orderNumber?.trim();
  const trimmedPhone = phone?.trim();

  if (!trimmedNumber && !trimmedPhone) return [];

  if (trimmedNumber && !trimmedPhone) {
    const one = orders.find(
      (order) => order.orderNumber.toLowerCase() === trimmedNumber.toLowerCase()
    );
    return one ? [one] : [];
  }

  const matched = trimmedPhone
    ? orders.filter((order) => phonesMatch(order.shippingAddress.phone, trimmedPhone))
    : orders;

  if (trimmedNumber) {
    const one = matched.find(
      (order) => order.orderNumber.toLowerCase() === trimmedNumber.toLowerCase()
    );
    return one ? [one] : [];
  }

  return matched
    .filter((order) => isUndeliveredOrderStatus(order.status))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** @deprecated Use trackOrders */
export async function trackOrdersByPhone(
  phone: string,
  orderNumber?: string
): Promise<Order[]> {
  return trackOrders(phone, orderNumber);
}

/** @deprecated Use trackOrdersByPhone — kept for single-order callers */
export async function trackOrderByNumberAndPhone(
  orderNumber: string,
  phone: string
): Promise<Order | null> {
  const orders = await trackOrdersByPhone(phone, orderNumber);
  return orders[0] ?? null;
}

export async function createOrder(order: Order): Promise<Order> {
  return getStore().create(COL.orders, order);
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  return getStore().update(COL.orders, id, { ...data, updatedAt: new Date().toISOString() });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getReviews(productId?: string): Promise<Review[]> {
  const reviews = await getStore().read<Review>(COL.reviews);
  if (productId) return reviews.filter((r) => r.productId === productId);
  return reviews;
}

async function syncProductReviewStats(productId: string): Promise<void> {
  const reviews = await getReviews(productId);
  const reviewCount = reviews.length;
  const rating = reviewCount
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
    : 0;

  await getStore().update<Product>(COL.products, productId, {
    rating,
    reviewCount,
    updatedAt: new Date().toISOString(),
  });
}

export async function createReview(review: Review): Promise<Review> {
  const created = await getStore().create(COL.reviews, review);
  await syncProductReviewStats(review.productId);
  return created;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
  const existing = await getStore().readOne<Review>(COL.reviews, id);
  if (!existing) return null;
  const updated = await getStore().update(COL.reviews, id, data);
  if (updated) {
    await syncProductReviewStats(updated.productId);
    if (data.productId && data.productId !== existing.productId) {
      await syncProductReviewStats(existing.productId);
    }
  }
  return updated;
}

export async function deleteReview(id: string): Promise<boolean> {
  const existing = await getStore().readOne<Review>(COL.reviews, id);
  const deleted = await getStore().delete(COL.reviews, id);
  if (deleted && existing) await syncProductReviewStats(existing.productId);
  return deleted;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUsers(role?: UserRole): Promise<UserRecord[]> {
  const users = await getStore().read<UserRecord>(COL.users);
  if (role) return users.filter((u) => u.role === role);
  return users;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  return getStore().readOne<UserRecord>(COL.users, id);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(user: UserRecord): Promise<UserRecord> {
  return getStore().create(COL.users, user);
}

export async function updateUser(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
  return getStore().update(COL.users, id, data);
}

export async function deleteUser(id: string): Promise<boolean> {
  return getStore().delete(COL.users, id);
}

export async function getReviewById(id: string): Promise<Review | null> {
  return getStore().readOne<Review>(COL.reviews, id);
}

export async function deleteOrder(id: string): Promise<boolean> {
  return getStore().delete(COL.orders, id);
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface StoreSettings {
  id: string;
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  standardShipping: number;
  expressShipping: number;
  freeShippingThreshold: number;
  currency: string;
  cmsPages: { slug: string; title: string; content: string }[];
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const items = await getStore().read<StoreSettings>("settings");
  return items[0] ?? {
    id: "settings-1",
    storeName: "Shahzad Poshish House",
    supportEmail: "shahzadahmed6626@gmail.com",
    supportPhone: "03224123414",
    standardShipping: 100,
    expressShipping: 250,
    freeShippingThreshold: 1500,
    currency: "PKR",
    cmsPages: [],
  };
}

export async function updateStoreSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = { ...current, ...data };
  const items = await getStore().read<StoreSettings>("settings");
  if (items.length === 0) {
    await getStore().create("settings", updated);
  } else {
    await getStore().update("settings", current.id, updated);
  }
  return updated;
}

export function toPublicUser(user: UserRecord): User {
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  return getStore().read<Coupon>(COL.coupons);
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const coupons = await getCoupons();
  return coupons.find((c) => c.code.toUpperCase() === code.toUpperCase()) ?? null;
}

export async function createCoupon(coupon: Coupon): Promise<Coupon> {
  return getStore().create(COL.coupons, coupon);
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
  return getStore().update(COL.coupons, id, data);
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  return getStore().readOne<Coupon>(COL.coupons, id);
}

export async function deleteCoupon(id: string): Promise<boolean> {
  return getStore().delete(COL.coupons, id);
}

// ─── Banners ─────────────────────────────────────────────────────────────────

export async function getAllBanners(): Promise<Banner[]> {
  return readAllBanners();
}

export async function getBanners(position?: Banner["position"]): Promise<Banner[]> {
  const banners = await readAllBanners();
  const active = banners.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  if (position) return active.filter((b) => b.position === position);
  return active;
}

export async function createBanner(banner: Banner): Promise<Banner> {
  return getStore().create(COL.banners, banner);
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<Banner | null> {
  return getStore().update(COL.banners, id, data);
}

export async function getBannerById(id: string): Promise<Banner | null> {
  return getStore().readOne<Banner>(COL.banners, id);
}

export async function deleteBanner(id: string): Promise<boolean> {
  return getStore().delete(COL.banners, id);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function getBookings(userId?: string): Promise<ServiceBooking[]> {
  const bookings = await getStore().read<ServiceBooking>(COL.bookings);
  if (userId) return bookings.filter((b) => b.userId === userId);
  return bookings;
}

export async function createBooking(booking: ServiceBooking): Promise<ServiceBooking> {
  return getStore().create(COL.bookings, booking);
}

export async function updateBooking(id: string, data: Partial<ServiceBooking>): Promise<ServiceBooking | null> {
  return getStore().update(COL.bookings, id, data);
}

export async function getBookingById(id: string): Promise<ServiceBooking | null> {
  return getStore().readOne<ServiceBooking>(COL.bookings, id);
}

export async function deleteBooking(id: string): Promise<boolean> {
  return getStore().delete(COL.bookings, id);
}

// ─── Contact & Newsletter ────────────────────────────────────────────────────

export async function createContactMessage(msg: ContactMessage): Promise<ContactMessage> {
  return getStore().create(COL.contactMessages, msg);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const items = await getStore().read<ContactMessage>(COL.contactMessages);
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getContactMessageById(id: string): Promise<ContactMessage | null> {
  return getStore().readOne<ContactMessage>(COL.contactMessages, id);
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  return getStore().delete(COL.contactMessages, id);
}

// ─── In-app Notifications ────────────────────────────────────────────────────

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  const items = await getStore().read<AppNotification>(COL.notifications);
  return items
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const items = await getNotifications(userId);
  return items.filter((n) => !n.read).length;
}

export async function createNotification(n: AppNotification): Promise<AppNotification> {
  return getStore().create(COL.notifications, n);
}

export async function updateNotification(
  id: string,
  data: Partial<AppNotification>
): Promise<AppNotification | null> {
  return getStore().update(COL.notifications, id, data);
}

export async function markNotificationRead(id: string, userId: string): Promise<boolean> {
  const n = await getStore().readOne<AppNotification>(COL.notifications, id);
  if (!n || n.userId !== userId) return false;
  await updateNotification(id, { read: true });
  return true;
}

export async function markAllNotificationsRead(userId: string): Promise<number> {
  const items = await getNotifications(userId);
  let count = 0;
  for (const n of items.filter((i) => !i.read)) {
    await updateNotification(n.id, { read: true });
    count += 1;
  }
  return count;
}

export async function subscribeNewsletter(sub: NewsletterSubscriber): Promise<NewsletterSubscriber> {
  const subs = await getStore().read<NewsletterSubscriber>(COL.newsletter);
  if (subs.some((s) => s.email.toLowerCase() === sub.email.toLowerCase())) {
    throw new Error("Already subscribed");
  }
  return getStore().create(COL.newsletter, sub);
}

// ─── Analytics & Admin Dashboard ─────────────────────────────────────────────

function growthPct(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const data = await getStore().read<AnalyticsData>(COL.analytics);
  return data[0] ?? { salesData: [], topProducts: [] };
}

export async function getAdminNavCounts(): Promise<AdminNavCounts> {
  const [orders, bookings, contactMessages] = await Promise.all([
    getOrders(),
    getBookings(),
    getContactMessages(),
  ]);
  return {
    orders: orders.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    contactMessages: contactMessages.length,
  };
}

export async function getAdminDashboardData(options?: { periodDays?: number }) {
  const [orders, products, users, bookings] = await Promise.all([
    getOrders(),
    getProducts(),
    getUsers("customer"),
    getBookings(),
  ]);

  const periodDays = options?.periodDays;
  const cutoff = periodDays ? new Date(Date.now() - periodDays * 86400000) : null;
  const periodOrders = cutoff
    ? orders.filter((o) => new Date(o.createdAt) >= cutoff)
    : orders;

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(thisMonthStart.getTime() - 1);

  const thisMonthOrders = orders.filter((o) => new Date(o.createdAt) >= thisMonthStart);
  const lastMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d >= lastMonthStart && d <= lastMonthEnd;
  });

  const revenueGrowth = growthPct(
    thisMonthOrders.reduce((s, o) => s + o.total, 0),
    lastMonthOrders.reduce((s, o) => s + o.total, 0)
  );
  const ordersGrowth = growthPct(thisMonthOrders.length, lastMonthOrders.length);

  const thisMonthCustomers = users.filter((u) => new Date(u.createdAt) >= thisMonthStart).length;
  const lastMonthCustomers = users.filter((u) => {
    const d = new Date(u.createdAt);
    return d >= lastMonthStart && d <= lastMonthEnd;
  }).length;
  const customersGrowth = growthPct(thisMonthCustomers, lastMonthCustomers);

  const statusMap = new Map<string, number>();
  for (const o of periodOrders) {
    statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1);
  }
  const orderStatusBreakdown: OrderStatusBreakdown[] = Array.from(statusMap.entries())
    .map(([status, value]) => ({
      status,
      name: formatStatusLabel(status),
      value,
      color: ORDER_STATUS_CHART_COLORS[status as keyof typeof ORDER_STATUS_CHART_COLORS] || "#6B7280",
    }))
    .sort((a, b) => b.value - a.value);

  const salesMap = new Map<string, { revenue: number; orders: number; sortKey: number }>();
  for (const o of periodOrders) {
    const d = new Date(o.createdAt);
    const useDaily = periodDays != null && periodDays <= 31;
    const key = useDaily
      ? d.toLocaleDateString("en-PK", { day: "numeric", month: "short" })
      : d.toLocaleDateString("en-PK", { month: "short", year: "2-digit" });
    const sortKey = useDaily ? d.getTime() : new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const cur = salesMap.get(key) || { revenue: 0, orders: 0, sortKey };
    cur.revenue += o.total;
    cur.orders += 1;
    salesMap.set(key, cur);
  }
  const salesData: SalesDataPoint[] = Array.from(salesMap.entries())
    .sort((a, b) => a[1].sortKey - b[1].sortKey)
    .map(([date, v]) => ({ date, revenue: v.revenue, orders: v.orders }));

  const productMap = new Map<string, TopProduct>();
  for (const o of periodOrders) {
    for (const item of o.items) {
      const existing = productMap.get(item.productId);
      const lineRevenue = item.price * item.quantity;
      if (existing) {
        existing.sales += item.quantity;
        existing.revenue += lineRevenue;
      } else {
        const prod = products.find((p) => p.id === item.productId);
        productMap.set(item.productId, {
          id: item.productId,
          name: item.productName,
          image: item.productImage || prod?.images[0]?.url || "",
          sales: item.quantity,
          revenue: lineRevenue,
        });
      }
    }
  }
  let topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  if (topProducts.length === 0) {
    const analytics = await getAnalytics();
    topProducts = analytics.topProducts.slice(0, 10);
  }

  if (salesData.length === 0) {
    const analytics = await getAnalytics();
    return {
      stats: buildDashboardStats(periodOrders, orders, products, users, bookings, revenueGrowth, ordersGrowth, customersGrowth),
      salesData: analytics.salesData,
      topProducts,
      orderStatusBreakdown,
      recentOrders: [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      navCounts: {
        orders: orders.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
      },
    };
  }

  return {
    stats: buildDashboardStats(periodOrders, orders, products, users, bookings, revenueGrowth, ordersGrowth, customersGrowth),
    salesData,
    topProducts,
    orderStatusBreakdown,
    recentOrders: [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    navCounts: {
      orders: orders.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
    },
  };
}

function buildDashboardStats(
  periodOrders: Order[],
  allOrders: Order[],
  products: Product[],
  users: User[],
  bookings: ServiceBooking[],
  revenueGrowth: number,
  ordersGrowth: number,
  customersGrowth: number
): DashboardStats {
  return {
    totalRevenue: periodOrders.reduce((s, o) => s + o.total, 0),
    revenueGrowth,
    totalOrders: periodOrders.length,
    ordersGrowth,
    totalCustomers: users.length,
    customersGrowth,
    totalProducts: products.length,
    lowStockProducts: products.filter((p) => p.stock < 10).length,
    pendingOrders: allOrders.filter((o) => o.status === "pending" || o.status === "processing").length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
  };
}

export async function getDashboardStats() {
  const data = await getAdminDashboardData();
  return data.stats;
}

// ─── Push Subscriptions ──────────────────────────────────────────────────────

export async function getPushSubscriptions(userId?: string): Promise<PushSubscriptionRecord[]> {
  const subs = await getStore().read<PushSubscriptionRecord>(COL.pushSubscriptions);
  if (userId) return subs.filter((s) => s.userId === userId);
  return subs;
}

export async function getPushSubscriptionByEndpoint(endpoint: string): Promise<PushSubscriptionRecord | null> {
  const subs = await getPushSubscriptions();
  return subs.find((s) => s.endpoint === endpoint) ?? null;
}

export async function savePushSubscription(record: PushSubscriptionRecord): Promise<PushSubscriptionRecord> {
  const existing = await getPushSubscriptionByEndpoint(record.endpoint);
  if (existing) {
    return (await getStore().update(COL.pushSubscriptions, existing.id, record)) ?? record;
  }
  return getStore().create(COL.pushSubscriptions, record);
}

export async function deletePushSubscription(endpoint: string): Promise<boolean> {
  const subs = await getPushSubscriptions();
  const match = subs.find((s) => s.endpoint === endpoint);
  if (!match) return false;
  return getStore().delete(COL.pushSubscriptions, match.id);
}

export async function deletePushSubscriptionsByUser(userId: string): Promise<void> {
  const subs = await getPushSubscriptions(userId);
  await Promise.all(subs.map((s) => getStore().delete(COL.pushSubscriptions, s.id)));
}

