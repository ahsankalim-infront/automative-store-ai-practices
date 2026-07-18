/** Shared admin sidebar nav definition (href keys = permission keys). */

export type AdminNavCountKey = "orders" | "pendingBookings" | "contactMessages";

export interface AdminNavItemDef {
  label: string;
  href: string;
  countKey?: AdminNavCountKey;
}

export interface AdminNavGroupDef {
  group: string;
  items: AdminNavItemDef[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroupDef[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    group: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", countKey: "orders" },
      { label: "Products", href: "/admin/products" },
      { label: "Categories", href: "/admin/categories" },
      { label: "Brands", href: "/admin/brands" },
      { label: "Inventory", href: "/admin/inventory" },
    ],
  },
  {
    group: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers" },
      { label: "Contact Messages", href: "/admin/contact-messages", countKey: "contactMessages" },
      { label: "Reviews", href: "/admin/reviews" },
    ],
  },
  {
    group: "Services",
    items: [
      { label: "Vehicle Database", href: "/admin/vehicles" },
      { label: "Services", href: "/admin/services" },
      { label: "Store Branches", href: "/admin/stores" },
      { label: "Bookings", href: "/admin/bookings", countKey: "pendingBookings" },
    ],
  },
  {
    group: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons" },
      { label: "Promotions", href: "/admin/promotions" },
      { label: "Banners", href: "/admin/banners" },
      { label: "Hero Slides", href: "/admin/hero-slides" },
      { label: "Bundle Offers", href: "/admin/bundle-offers" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blogs" },
      { label: "About Page", href: "/admin/about-content" },
      { label: "Homepage Layout", href: "/admin/home-layout" },
      { label: "SEO", href: "/admin/seo" },
      { label: "Media Library", href: "/admin/media" },
      { label: "CMS Pages", href: "/admin/cms" },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Activity Logs", href: "/admin/activity-logs" },
      { label: "Cache", href: "/admin/cache" },
      { label: "Reports", href: "/admin/reports" },
      { label: "Notifications", href: "/admin/notifications" },
      { label: "Roles & Permissions", href: "/admin/roles" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];

export const ALL_ADMIN_PERMISSION_KEYS: string[] = ADMIN_NAV_GROUPS.flatMap((g) =>
  g.items.map((i) => i.href)
);

export function hrefsForGroups(...groups: string[]): string[] {
  const set = new Set(groups.map((g) => g.toLowerCase()));
  return ADMIN_NAV_GROUPS.filter((g) => set.has(g.group.toLowerCase())).flatMap((g) =>
    g.items.map((i) => i.href)
  );
}
