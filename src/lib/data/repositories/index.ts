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
  BundleOffer,
  AboutTeamMember,
  AboutMilestone,
  HeroSlide,
  PromotionPopup,
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
  readAllBundleOffers,
  readAllAboutTeam,
  readAllAboutMilestones,
  readAllHeroSlides,
  readAllPromotionPopups,
} from "../cached-reads";
import { revalidateEntityCache } from "@/lib/cache/entity-cache";
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
import type {
  ActivityLog,
  ActivityLogQuery,
  ActivityLogPage,
} from "@/lib/activity-log/types";
import { MAX_ACTIVITY_LOGS } from "@/lib/activity-log/types";

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
  bundleOffers: "bundle-offers",
  aboutTeam: "about-team",
  aboutMilestones: "about-milestones",
  heroSlides: "hero-slides",
  promotionPopups: "promotion-popups",
  bookings: "bookings",
  contactMessages: "contact-messages",
  newsletter: "newsletter-subscribers",
  analytics: "analytics",
  pushSubscriptions: "push-subscriptions",
  notifications: "notifications",
  activityLogs: "activity-logs",
} as const;

/** Clear Next.js cache tags for a collection after write. */
function touchCache(resource: string) {
  revalidateEntityCache(resource);
}

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

  if (!filters.includeInactiveCategories) {
    const categories = await readAllCategories();
    const activeSlugs = new Set(
      categories.filter((c) => c.isActive !== false).map((c) => c.slug)
    );
    items = items.filter((p) => activeSlugs.has(p.categorySlug));
  }

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
  touchCache(COL.products);
  return created;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const updated = await getStore().update(COL.products, id, { ...data, updatedAt: new Date().toISOString() });
  if (updated) {
    await syncProductRelations(updated);
    touchCache(COL.products);
  }
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.products, id);
  if (deleted) {
    await deleteProductRelations(id);
    touchCache(COL.products);
  }
  return deleted;
}

// ─── Categories ──────────────────────────────────────────────────────────────

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    isActive: category.isActive !== false,
  };
}

async function enrichCategories(categories: Category[]): Promise<Category[]> {
  const products = await readAllProducts();
  return categories
    .map(normalizeCategory)
    .map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categorySlug === cat.slug).length,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** All categories including inactive — for admin. */
export async function getAllCategories(): Promise<Category[]> {
  return enrichCategories(await readAllCategories());
}

/** Active categories only — for storefront and public API. */
export async function getCategories(): Promise<Category[]> {
  const all = await getAllCategories();
  return all.filter((cat) => cat.isActive);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await getStore().readOne<Category>(COL.categories, id);
  return category ? normalizeCategory(category) : null;
}

export async function createCategory(category: Category): Promise<Category> {
  const created = await getStore().create(COL.categories, normalizeCategory(category));
  touchCache(COL.categories);
  return created;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  const updated = await getStore().update(COL.categories, id, data);
  if (updated) touchCache(COL.categories);
  return updated ? normalizeCategory(updated) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.categories, id);
  if (deleted) touchCache(COL.categories);
  return deleted;
}

// ─── Brands ──────────────────────────────────────────────────────────────────

export async function getBrands(): Promise<Brand[]> {
  return readAllBrands();
}

export async function createBrand(brand: Brand): Promise<Brand> {
  const created = await getStore().create(COL.brands, brand);
  touchCache(COL.brands);
  return created;
}

export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand | null> {
  const updated = await getStore().update(COL.brands, id, data);
  if (updated) touchCache(COL.brands);
  return updated;
}

export async function deleteBrand(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.brands, id);
  if (deleted) touchCache(COL.brands);
  return deleted;
}

export async function getBrandById(id: string): Promise<Brand | null> {
  return getStore().readOne<Brand>(COL.brands, id);
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export async function getVehicleMakes(): Promise<VehicleMake[]> {
  return readAllVehicleMakes();
}

export async function updateVehicleMakes(makes: VehicleMake[]): Promise<void> {
  await getStore().write(COL.vehicleMakes, makes);
  touchCache(COL.vehicleMakes);
}

export async function getVehicleMakeById(id: string): Promise<VehicleMake | null> {
  return getStore().readOne<VehicleMake>(COL.vehicleMakes, id);
}

export async function createVehicleMake(make: VehicleMake): Promise<VehicleMake> {
  const created = await getStore().create(COL.vehicleMakes, make);
  touchCache(COL.vehicleMakes);
  return created;
}

export async function updateVehicleMake(id: string, data: Partial<VehicleMake>): Promise<VehicleMake | null> {
  const updated = await getStore().update(COL.vehicleMakes, id, data);
  if (updated) touchCache(COL.vehicleMakes);
  return updated;
}

export async function deleteVehicleMake(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.vehicleMakes, id);
  if (deleted) touchCache(COL.vehicleMakes);
  return deleted;
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
  const created = await getStore().create(COL.blogs, post);
  touchCache(COL.blogs);
  return created;
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
  const updated = await getStore().update(COL.blogs, id, data);
  if (updated) touchCache(COL.blogs);
  return updated;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.blogs, id);
  if (deleted) touchCache(COL.blogs);
  return deleted;
}

// ─── Services & Stores ───────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  return readAllServices();
}

export async function getStores(): Promise<Store[]> {
  return readAllStores();
}

export async function createService(service: Service): Promise<Service> {
  const created = await getStore().create(COL.services, service);
  touchCache(COL.services);
  return created;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service | null> {
  const updated = await getStore().update(COL.services, id, data);
  if (updated) touchCache(COL.services);
  return updated;
}

export async function getServiceById(id: string): Promise<Service | null> {
  return getStore().readOne<Service>(COL.services, id);
}

export async function deleteService(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.services, id);
  if (deleted) touchCache(COL.services);
  return deleted;
}

export async function createStore(store: Store): Promise<Store> {
  const created = await getStore().create(COL.stores, store);
  touchCache(COL.stores);
  return created;
}

export async function updateStore(id: string, data: Partial<Store>): Promise<Store | null> {
  const updated = await getStore().update(COL.stores, id, data);
  if (updated) touchCache(COL.stores);
  return updated;
}

export async function getStoreById(id: string): Promise<Store | null> {
  return getStore().readOne<Store>(COL.stores, id);
}

export async function deleteStore(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.stores, id);
  if (deleted) touchCache(COL.stores);
  return deleted;
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
  const created = await getStore().create(COL.orders, order);
  touchCache(COL.orders);
  return created;
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  const updated = await getStore().update(COL.orders, id, { ...data, updatedAt: new Date().toISOString() });
  if (updated) touchCache(COL.orders);
  return updated;
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
  touchCache(COL.products);
}

export async function createReview(review: Review): Promise<Review> {
  const created = await getStore().create(COL.reviews, review);
  await syncProductReviewStats(review.productId);
  touchCache(COL.reviews);
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
    touchCache(COL.reviews);
  }
  return updated;
}

export async function deleteReview(id: string): Promise<boolean> {
  const existing = await getStore().readOne<Review>(COL.reviews, id);
  const deleted = await getStore().delete(COL.reviews, id);
  if (deleted && existing) {
    await syncProductReviewStats(existing.productId);
    touchCache(COL.reviews);
  }
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
  const created = await getStore().create(COL.users, user);
  touchCache(COL.users);
  return created;
}

export async function updateUser(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
  const updated = await getStore().update(COL.users, id, data);
  if (updated) touchCache(COL.users);
  return updated;
}

export async function deleteUser(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.users, id);
  if (deleted) touchCache(COL.users);
  return deleted;
}

export async function getReviewById(id: string): Promise<Review | null> {
  return getStore().readOne<Review>(COL.reviews, id);
}

export async function deleteOrder(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.orders, id);
  if (deleted) touchCache(COL.orders);
  return deleted;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface StoreContactPerson {
  name: string;
  phones: string[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  shortName: string;
  tagline: string;
  description: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  orderPrefix: string;
  businessHours: string;
  announcementText: string;
  address: string;
  addressCity: string;
  addressProvince: string;
  addressCountry: string;
  contactPersons: StoreContactPerson[];
  standardShipping: number;
  expressShipping: number;
  freeShippingThreshold: number;
  currency: string;
  cmsPages: { slug: string; title: string; content: string }[];
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: "settings-1",
  storeName: "Shahzad Poshish House",
  shortName: "SPH",
  tagline: "Premium car poshish & upholstery",
  description:
    "Shahzad Poshish House offers premium car poshish, seat covers, interior upholstery and automotive accessories in Lahore.",
  supportEmail: "shahzadahmed6626@gmail.com",
  supportPhone: "03224123414",
  whatsapp: "923224123414",
  orderPrefix: "SHP",
  businessHours: "Monday – Saturday: 10:00 AM – 8:00 PM",
  announcementText: "Premium poshish & seat covers",
  address: "Office # 15, 2nd Floor, Moeen Center, 20 Abbot Road, Lahore",
  addressCity: "Lahore",
  addressProvince: "Punjab",
  addressCountry: "Pakistan",
  contactPersons: [
    { name: "Shahzad Ahmed", phones: ["03224123414", "033014140440"] },
    { name: "Muhammad Azaan", phones: ["03259422044"] },
  ],
  standardShipping: 100,
  expressShipping: 250,
  freeShippingThreshold: 1500,
  currency: "PKR",
  cmsPages: [],
};

function normalizeStoreSettings(raw?: Partial<StoreSettings> | null): StoreSettings {
  if (!raw) return { ...DEFAULT_STORE_SETTINGS };
  return {
    ...DEFAULT_STORE_SETTINGS,
    ...raw,
    contactPersons:
      raw.contactPersons?.length ? raw.contactPersons : DEFAULT_STORE_SETTINGS.contactPersons,
    cmsPages: raw.cmsPages ?? DEFAULT_STORE_SETTINGS.cmsPages,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const items = await getStore().read<StoreSettings>("settings");
  return normalizeStoreSettings(items[0]);
}

export async function updateStoreSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated = normalizeStoreSettings({ ...current, ...data });
  const items = await getStore().read<StoreSettings>("settings");
  if (items.length === 0) {
    await getStore().create("settings", updated);
  } else {
    await getStore().update("settings", current.id, updated);
  }
  touchCache("settings");
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
  const created = await getStore().create(COL.coupons, coupon);
  touchCache(COL.coupons);
  return created;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon | null> {
  const updated = await getStore().update(COL.coupons, id, data);
  if (updated) touchCache(COL.coupons);
  return updated;
}

export async function getCouponById(id: string): Promise<Coupon | null> {
  return getStore().readOne<Coupon>(COL.coupons, id);
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.coupons, id);
  if (deleted) touchCache(COL.coupons);
  return deleted;
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
  const created = await getStore().create(COL.banners, banner);
  touchCache(COL.banners);
  return created;
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<Banner | null> {
  const updated = await getStore().update(COL.banners, id, data);
  if (updated) touchCache(COL.banners);
  return updated;
}

export async function getBannerById(id: string): Promise<Banner | null> {
  return getStore().readOne<Banner>(COL.banners, id);
}

export async function deleteBanner(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.banners, id);
  if (deleted) touchCache(COL.banners);
  return deleted;
}

// ─── Bundle Offers ───────────────────────────────────────────────────────────

export async function getAllBundleOffers(): Promise<BundleOffer[]> {
  return readAllBundleOffers();
}

export async function getBundleOffers(): Promise<BundleOffer[]> {
  const offers = await readAllBundleOffers();
  return offers.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function createBundleOffer(offer: BundleOffer): Promise<BundleOffer> {
  const created = await getStore().create(COL.bundleOffers, offer);
  touchCache(COL.bundleOffers);
  return created;
}

export async function updateBundleOffer(id: string, data: Partial<BundleOffer>): Promise<BundleOffer | null> {
  const updated = await getStore().update(COL.bundleOffers, id, data);
  if (updated) touchCache(COL.bundleOffers);
  return updated;
}

export async function getBundleOfferById(id: string): Promise<BundleOffer | null> {
  return getStore().readOne<BundleOffer>(COL.bundleOffers, id);
}

export async function deleteBundleOffer(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.bundleOffers, id);
  if (deleted) touchCache(COL.bundleOffers);
  return deleted;
}

// ─── About Page Content ──────────────────────────────────────────────────────

export async function getAllAboutTeamMembers(): Promise<AboutTeamMember[]> {
  return readAllAboutTeam();
}

export async function getAboutTeamMembers(): Promise<AboutTeamMember[]> {
  const members = await readAllAboutTeam();
  return members.filter((m) => m.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAboutTeamMemberById(id: string): Promise<AboutTeamMember | null> {
  return getStore().readOne<AboutTeamMember>(COL.aboutTeam, id);
}

export async function createAboutTeamMember(member: AboutTeamMember): Promise<AboutTeamMember> {
  const created = await getStore().create(COL.aboutTeam, member);
  touchCache(COL.aboutTeam);
  return created;
}

export async function updateAboutTeamMember(
  id: string,
  data: Partial<AboutTeamMember>
): Promise<AboutTeamMember | null> {
  const updated = await getStore().update(COL.aboutTeam, id, data);
  if (updated) touchCache(COL.aboutTeam);
  return updated;
}

export async function deleteAboutTeamMember(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.aboutTeam, id);
  if (deleted) touchCache(COL.aboutTeam);
  return deleted;
}

export async function getAllAboutMilestones(): Promise<AboutMilestone[]> {
  return readAllAboutMilestones();
}

export async function getAboutMilestones(): Promise<AboutMilestone[]> {
  const items = await readAllAboutMilestones();
  return items.filter((m) => m.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAboutMilestoneById(id: string): Promise<AboutMilestone | null> {
  return getStore().readOne<AboutMilestone>(COL.aboutMilestones, id);
}

export async function createAboutMilestone(milestone: AboutMilestone): Promise<AboutMilestone> {
  const created = await getStore().create(COL.aboutMilestones, milestone);
  touchCache(COL.aboutMilestones);
  return created;
}

export async function updateAboutMilestone(
  id: string,
  data: Partial<AboutMilestone>
): Promise<AboutMilestone | null> {
  const updated = await getStore().update(COL.aboutMilestones, id, data);
  if (updated) touchCache(COL.aboutMilestones);
  return updated;
}

export async function deleteAboutMilestone(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.aboutMilestones, id);
  if (deleted) touchCache(COL.aboutMilestones);
  return deleted;
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  return readAllHeroSlides();
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const slides = await readAllHeroSlides();
  if (slides.length === 0) {
    const { DEFAULT_HERO_SLIDES } = await import("@/lib/hero-slides/defaults");
    return DEFAULT_HERO_SLIDES;
  }
  return slides.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  return getStore().readOne<HeroSlide>(COL.heroSlides, id);
}

export async function createHeroSlide(slide: HeroSlide): Promise<HeroSlide> {
  const created = await getStore().create(COL.heroSlides, slide);
  touchCache(COL.heroSlides);
  return created;
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide | null> {
  const updated = await getStore().update(COL.heroSlides, id, data);
  if (updated) touchCache(COL.heroSlides);
  return updated;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.heroSlides, id);
  if (deleted) touchCache(COL.heroSlides);
  return deleted;
}

// ─── Promotion Popups ────────────────────────────────────────────────────────

function isPromotionPopupActive(popup: PromotionPopup, now = Date.now()): boolean {
  if (popup.isActive === false) return false;
  if (popup.validFrom && new Date(popup.validFrom).getTime() > now) return false;
  if (popup.validTo && new Date(popup.validTo).getTime() < now) return false;
  return true;
}

export async function getAllPromotionPopups(): Promise<PromotionPopup[]> {
  return readAllPromotionPopups();
}

/** Active popup with lowest sortOrder for landing page display */
export async function getPromotionPopup(): Promise<PromotionPopup | null> {
  const popups = await readAllPromotionPopups();
  if (popups.length === 0) {
    const { DEFAULT_PROMOTION_POPUPS } = await import("@/lib/promotion-popup/defaults");
    const fallback = DEFAULT_PROMOTION_POPUPS.find((p) => isPromotionPopupActive(p));
    return fallback ?? null;
  }
  const active = popups
    .filter((p) => isPromotionPopupActive(p))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return active[0] ?? null;
}

export async function getPromotionPopupById(id: string): Promise<PromotionPopup | null> {
  return getStore().readOne<PromotionPopup>(COL.promotionPopups, id);
}

export async function createPromotionPopup(popup: PromotionPopup): Promise<PromotionPopup> {
  const created = await getStore().create(COL.promotionPopups, popup);
  touchCache(COL.promotionPopups);
  return created;
}

export async function updatePromotionPopup(
  id: string,
  data: Partial<PromotionPopup>
): Promise<PromotionPopup | null> {
  const updated = await getStore().update(COL.promotionPopups, id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  if (updated) touchCache(COL.promotionPopups);
  return updated;
}

export async function deletePromotionPopup(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.promotionPopups, id);
  if (deleted) touchCache(COL.promotionPopups);
  return deleted;
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function getBookings(userId?: string): Promise<ServiceBooking[]> {
  const bookings = await getStore().read<ServiceBooking>(COL.bookings);
  if (userId) return bookings.filter((b) => b.userId === userId);
  return bookings;
}

export async function createBooking(booking: ServiceBooking): Promise<ServiceBooking> {
  const created = await getStore().create(COL.bookings, booking);
  touchCache(COL.bookings);
  return created;
}

export async function updateBooking(id: string, data: Partial<ServiceBooking>): Promise<ServiceBooking | null> {
  const updated = await getStore().update(COL.bookings, id, data);
  if (updated) touchCache(COL.bookings);
  return updated;
}

export async function getBookingById(id: string): Promise<ServiceBooking | null> {
  return getStore().readOne<ServiceBooking>(COL.bookings, id);
}

export async function deleteBooking(id: string): Promise<boolean> {
  const deleted = await getStore().delete(COL.bookings, id);
  if (deleted) touchCache(COL.bookings);
  return deleted;
}

// ─── Contact & Newsletter ────────────────────────────────────────────────────

export async function createContactMessage(msg: ContactMessage): Promise<ContactMessage> {
  const created = await getStore().create(COL.contactMessages, msg);
  touchCache(COL.contactMessages);
  return created;
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
  const deleted = await getStore().delete(COL.contactMessages, id);
  if (deleted) touchCache(COL.contactMessages);
  return deleted;
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
  const created = await getStore().create(COL.notifications, n);
  touchCache(COL.notifications);
  return created;
}

export async function updateNotification(
  id: string,
  data: Partial<AppNotification>
): Promise<AppNotification | null> {
  const updated = await getStore().update(COL.notifications, id, data);
  if (updated) touchCache(COL.notifications);
  return updated;
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
  const created = await getStore().create(COL.newsletter, sub);
  touchCache(COL.newsletter);
  return created;
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
    const updated = (await getStore().update(COL.pushSubscriptions, existing.id, record)) ?? record;
    touchCache(COL.pushSubscriptions);
    return updated;
  }
  const created = await getStore().create(COL.pushSubscriptions, record);
  touchCache(COL.pushSubscriptions);
  return created;
}

export async function deletePushSubscription(endpoint: string): Promise<boolean> {
  const subs = await getPushSubscriptions();
  const match = subs.find((s) => s.endpoint === endpoint);
  if (!match) return false;
  const deleted = await getStore().delete(COL.pushSubscriptions, match.id);
  if (deleted) touchCache(COL.pushSubscriptions);
  return deleted;
}

export async function deletePushSubscriptionsByUser(userId: string): Promise<void> {
  const subs = await getPushSubscriptions(userId);
  await Promise.all(subs.map((s) => getStore().delete(COL.pushSubscriptions, s.id)));
  if (subs.length) touchCache(COL.pushSubscriptions);
}

// ─── Activity Logs ───────────────────────────────────────────────────────────

export type { ActivityLog, ActivityLogQuery, ActivityLogPage };

export async function createActivityLog(log: ActivityLog): Promise<ActivityLog> {
  const store = getStore();
  const created = await store.create(COL.activityLogs, log);

  const all = await store.read<ActivityLog>(COL.activityLogs);
  if (all.length > MAX_ACTIVITY_LOGS) {
    const sorted = [...all].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const excess = sorted.slice(MAX_ACTIVITY_LOGS);
    await Promise.all(excess.map((entry) => store.delete(COL.activityLogs, entry.id)));
  }

  return created;
}

export async function queryActivityLogs(query: ActivityLogQuery = {}): Promise<ActivityLogPage> {
  let items = await getStore().read<ActivityLog>(COL.activityLogs);
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (query.category) {
    items = items.filter((l) => l.category === query.category);
  }
  if (query.status) {
    items = items.filter((l) => l.status === query.status);
  }
  if (query.dateFrom) {
    const from = new Date(query.dateFrom).getTime();
    items = items.filter((l) => new Date(l.createdAt).getTime() >= from);
  }
  if (query.dateTo) {
    const to = new Date(query.dateTo).getTime();
    items = items.filter((l) => new Date(l.createdAt).getTime() <= to);
  }
  if (query.search?.trim()) {
    const q = query.search.trim().toLowerCase();
    items = items.filter(
      (l) =>
        l.message.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.actorEmail?.toLowerCase().includes(q) ||
        l.actorName?.toLowerCase().includes(q) ||
        l.entityType?.toLowerCase().includes(q) ||
        l.entityId?.toLowerCase().includes(q) ||
        l.path?.toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const offset = Math.max(0, query.offset ?? 0);
  const limit = Math.min(Math.max(1, query.limit ?? 50), 200);

  return {
    items: items.slice(offset, offset + limit),
    total,
    limit,
    offset,
  };
}

