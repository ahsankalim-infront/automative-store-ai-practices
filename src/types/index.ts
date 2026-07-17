// ─── Product Types ───────────────────────────────────────────────────────────

import type { EntitySeo } from "@/lib/seo/types";

export type { EntitySeo };

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku: string;
}

export interface ProductSpecification {
  id?: string;
  label: string;
  value: string;
}

export interface VehicleCompatibility {
  id?: string;
  brand: string;
  model: string;
  makeSlug?: string;
  modelSlug?: string;
  vehicleMakeId?: string;
  vehicleModelId?: string;
  yearFrom: number;
  yearTo: number;
  variants?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  images: ProductImage[];
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  specifications: ProductSpecification[];
  variants?: ProductVariant[];
  vehicleCompatibility?: VehicleCompatibility[];
  installationAvailable: boolean;
  installationPrice?: number;
  warranty?: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  flashSaleEnds?: string;
  weight?: number;
  dimensions?: string;
  createdAt: string;
  updatedAt: string;
  seo?: EntitySeo;
}

// ─── Category Types ────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  productCount: number;
  parentId?: string;
  subcategories?: Category[];
  sortOrder: number;
  isActive: boolean;
}

// ─── Brand Types ──────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description?: string;
  productCount: number;
  isPrivateLabel: boolean;
  country?: string;
}

// ─── Vehicle Types ────────────────────────────────────────────────────────────

export interface VehicleMake {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  country?: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  id: string;
  slug: string;
  name: string;
  makeId: string;
  makeName: string;
  years: number[];
  variants?: string[];
  bodyType?: "Hatchback" | "Sedan" | "SUV" | "Crossover" | "Pickup Truck" | "Minivan";
  image?: string;
}

export interface SelectedVehicle {
  make: string;
  makeSlug: string;
  model: string;
  modelSlug: string;
  year: number;
  variant?: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentMethod = "cod" | "card" | "bank_transfer" | "wallet";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  sku: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  variant?: string;
  installationRequested?: boolean;
  installationPrice?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  couponCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  installationRequested?: boolean;
  installationPrice?: number;
  maxStock: number;
}

// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = "customer" | "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  addresses: ShippingAddress[];
  createdAt: string;
  isVerified: boolean;
  loyaltyPoints?: number;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

// ─── Blog Types ───────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  readTime: number;
  viewCount: number;
  publishedAt: string;
  isFeatured: boolean;
  seo?: EntitySeo;
}

// ─── Service Types ────────────────────────────────────────────────────────────

export type ServiceType = "ppf" | "detailing" | "installation" | "ceramic" | "tint" | "inspection";

export interface Service {
  id: string;
  slug: string;
  type: ServiceType;
  name: string;
  description: string;
  image: string;
  priceFrom: number;
  priceTo?: number;
  duration?: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  userName: string;
  userPhone: string;
  branchId: string;
  branchName: string;
  date: string;
  timeSlot: string;
  vehicleInfo?: string;
  notes?: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  price?: number;
  createdAt: string;
}

// ─── Store / Branch Types ─────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  hours: string;
  services: string[];
  coordinates?: { lat: number; lng: number };
  image?: string;
  isMainBranch?: boolean;
}

// ─── Coupon Types ─────────────────────────────────────────────────────────────

export type DiscountType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

// ─── Banner Types ─────────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  mobileImage?: string;
  position: "hero" | "middle" | "bottom" | "sidebar";
  isActive: boolean;
  sortOrder: number;
}

// ─── Hero Carousel Slides ─────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  mobileTitle: string;
  highlight: string;
  mobileCta: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  productImage: string;
  productLabel: string;
  productPrice: string;
  badgeIcon: string;
  badgeText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  leftBg: string;
  rightBg: string;
  accent: string;
  accentLight: string;
  sortOrder: number;
  isActive: boolean;
}

// ─── Bundle Offers ────────────────────────────────────────────────────────────

export interface BundleOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  href: string;
  tag?: string;
  productIds?: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface BundleOffersSectionConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  viewAllHref: string;
  isEnabled: boolean;
  updatedAt: string;
}

// ─── About Page Content ───────────────────────────────────────────────────────

export interface AboutSectionConfig {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  isEnabled: boolean;
  updatedAt: string;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AboutMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AboutPageContent {
  journeySection: AboutSectionConfig;
  leadershipSection: AboutSectionConfig;
  team: AboutTeamMember[];
  milestones: AboutMilestone[];
}

// ─── Admin Dashboard Types ────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  pendingBookings: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  status: string;
  name: string;
  value: number;
  color: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface AdminNavCounts {
  orders: number;
  pendingBookings: number;
  contactMessages: number;
  unreadNotifications?: number;
}

export type NotificationAudience = "customer" | "admin";
export type NotificationType = "order_placed" | "order_update" | "system";

export interface AppNotification {
  id: string;
  userId: string;
  audience: NotificationAudience;
  type: NotificationType;
  title: string;
  body: string;
  orderId?: string;
  orderNumber?: string;
  link?: string;
  read: boolean;
  emailSent: boolean;
  pushSent: boolean;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  salesData: SalesDataPoint[];
  topProducts: TopProduct[];
  orderStatusBreakdown: OrderStatusBreakdown[];
  recentOrders: Order[];
  navCounts: AdminNavCounts;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface ProductFilters {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  inStock: boolean;
  onSale: boolean;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
}

export type SortOption =
  | "popularity"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "name_asc";
