import type { Order, Review, DashboardStats, SalesDataPoint, TopProduct } from "@/types";

export const mockOrders: Order[] = [
  {
    id: "ord-001", orderNumber: "AZ-2026-001234", userId: "u-001",
    items: [
      { id: "oi-1", productId: "p-001", productName: "Maximus Sirius LED H4 - 85W", productImage: "", productSlug: "maximus-sirius-led-h4-85w", sku: "MXS-LED-H4-85W", quantity: 1, price: 15000, installationRequested: true, installationPrice: 1500 },
      { id: "oi-2", productId: "p-006", productName: "Maximus Microfiber Cloth MFC-1", productImage: "", productSlug: "maximus-microfiber-cloth-mfc1", sku: "MXP-MFC1-60X30", quantity: 2, price: 400 },
    ],
    subtotal: 16300, shippingCost: 0, discount: 500, tax: 0, total: 15800,
    status: "delivered", paymentMethod: "cod", paymentStatus: "paid",
    shippingAddress: { fullName: "Ahmed Khan", phone: "0300-1234567", address: "House 23, Street 5, Gulberg III", city: "Lahore", state: "Punjab", country: "Pakistan" },
    couponCode: "WELCOME500", trackingNumber: "TCS-PKT-20260701",
    createdAt: "2026-07-01T10:30:00Z", updatedAt: "2026-07-05T14:00:00Z",
  },
  {
    id: "ord-002", orderNumber: "AZ-2026-001235", userId: "u-001",
    items: [
      { id: "oi-3", productId: "p-003", productName: "Toyota Corolla 5D Floor Mats", productImage: "", productSlug: "toyota-corolla-5d-floor-mats", sku: "MAT-COR-5D-BLK", quantity: 1, price: 8500 },
    ],
    subtotal: 8500, shippingCost: 250, discount: 0, tax: 0, total: 8750,
    status: "shipped", paymentMethod: "card", paymentStatus: "paid",
    shippingAddress: { fullName: "Ahmed Khan", phone: "0300-1234567", address: "House 23, Street 5, Gulberg III", city: "Lahore", state: "Punjab", country: "Pakistan" },
    trackingNumber: "TCS-PKT-20260710",
    createdAt: "2026-07-08T15:00:00Z", updatedAt: "2026-07-10T09:00:00Z",
  },
  {
    id: "ord-003", orderNumber: "AZ-2026-001236", userId: "u-001",
    items: [
      { id: "oi-4", productId: "p-007", productName: "Android Panel 9\" Toyota Corolla", productImage: "", productSlug: "android-panel-9inch-toyota-corolla", sku: "AND-9-COR-14-24", quantity: 1, price: 38000, installationRequested: true, installationPrice: 3000 },
    ],
    subtotal: 41000, shippingCost: 0, discount: 0, tax: 0, total: 41000,
    status: "processing", paymentMethod: "bank_transfer", paymentStatus: "paid",
    shippingAddress: { fullName: "Ahmed Khan", phone: "0300-1234567", address: "House 23, Street 5, Gulberg III", city: "Lahore", state: "Punjab", country: "Pakistan" },
    createdAt: "2026-07-12T08:00:00Z", updatedAt: "2026-07-12T10:00:00Z",
  },
];

export const mockReviews: Review[] = [
  { id: "r-001", productId: "p-001", userId: "u-001", userName: "Ahmed Khan", rating: 5, title: "Excellent LED lights!", body: "Installed on my Toyota Corolla. Massive improvement over stock halogen. Very bright, no flicker issues.", isVerifiedPurchase: true, helpfulCount: 12, createdAt: "2026-07-05T00:00:00Z" },
  { id: "r-002", productId: "p-003", userId: "u-002", userName: "Sara Malik", rating: 5, title: "Perfect fit for Corolla", body: "Exactly as described. Custom fit is spot on. Easy installation and looks premium.", isVerifiedPurchase: true, helpfulCount: 8, createdAt: "2026-06-28T00:00:00Z" },
  { id: "r-003", productId: "p-004", userId: "u-003", userName: "Usman Raza", rating: 4, title: "Good quality seat covers", body: "Nice material, easy to install. A bit tricky around the headrests but overall very satisfied.", isVerifiedPurchase: true, helpfulCount: 5, createdAt: "2026-06-20T00:00:00Z" },
];

export const dashboardStats: DashboardStats = {
  totalRevenue: 2847650,
  revenueGrowth: 18.5,
  totalOrders: 1234,
  ordersGrowth: 12.3,
  totalCustomers: 5678,
  customersGrowth: 8.7,
  totalProducts: 2145,
  lowStockProducts: 23,
  pendingOrders: 45,
  pendingBookings: 12,
};

export const salesData: SalesDataPoint[] = [
  { date: "Jan", revenue: 185000, orders: 89 },
  { date: "Feb", revenue: 220000, orders: 102 },
  { date: "Mar", revenue: 195000, orders: 95 },
  { date: "Apr", revenue: 310000, orders: 145 },
  { date: "May", revenue: 285000, orders: 132 },
  { date: "Jun", revenue: 420000, orders: 198 },
  { date: "Jul", revenue: 380000, orders: 175 },
];

export const topProducts: TopProduct[] = [
  { id: "p-006", name: "Maximus Microfiber Cloth MFC-1", image: "", sales: 450, revenue: 180000 },
  { id: "p-005", name: "Maximus Polishing Compound 200g", image: "", sales: 380, revenue: 133000 },
  { id: "p-001", name: "Maximus Sirius LED H4 - 85W", image: "", sales: 156, revenue: 2340000 },
  { id: "p-003", name: "Toyota Corolla 5D Floor Mats", image: "", sales: 134, revenue: 1139000 },
  { id: "p-004", name: "Universal Seat Covers PU Leather", image: "", sales: 98, revenue: 1176000 },
];
