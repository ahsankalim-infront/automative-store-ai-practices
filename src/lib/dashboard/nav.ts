import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  Calendar,
  Bell,
  User,
  type LucideIcon,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  /** Show numeric badge when count > 0 */
  countKey?: "orders" | "wishlist" | "bookings";
}

export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, description: "Summary & quick actions" },
  { label: "My Orders", href: "/dashboard/orders", icon: Package, countKey: "orders", description: "Track & reorder purchases" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart, countKey: "wishlist", description: "Saved products" },
  { label: "Addresses", href: "/dashboard/addresses", icon: MapPin, description: "Shipping addresses" },
  { label: "Bookings", href: "/dashboard/bookings", icon: Calendar, countKey: "bookings", description: "PPF & service appointments" },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, description: "Alerts & preferences" },
  { label: "Profile", href: "/dashboard/profile", icon: User, description: "Account settings" },
];

export function getDashboardTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Overview";
  const item = DASHBOARD_NAV.find((n) => n.href === pathname);
  return item?.label ?? "Dashboard";
}
