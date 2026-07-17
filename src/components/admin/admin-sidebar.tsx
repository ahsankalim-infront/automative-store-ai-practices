"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Users, Package, FolderTree, Tag, Warehouse, Car, Wrench, Calendar, Ticket, Megaphone, Image, Star, FileText, BarChart3, Bell, Shield, Settings, ChevronLeft, ChevronRight, LogOut, Globe, FolderOpen, Mail, Search, LayoutTemplate, Milestone, Presentation, ScrollText,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { useBrand } from "@/lib/brand/brand-context";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import type { AdminNavCounts } from "@/types";

const navItems = [
  { group: "Overview", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]},
  { group: "Commerce", items: [
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag, countKey: "orders" as const },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Brands", href: "/admin/brands", icon: Tag },
    { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  ]},
  { group: "Customers", items: [
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Contact Messages", href: "/admin/contact-messages", icon: Mail, countKey: "contactMessages" as const },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
  ]},
  { group: "Services", items: [
    { label: "Vehicle Database", href: "/admin/vehicles", icon: Car },
    { label: "Services", href: "/admin/services", icon: Wrench },
    { label: "Store Branches", href: "/admin/stores", icon: Globe },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar, countKey: "pendingBookings" as const },
  ]},
  { group: "Marketing", items: [
    { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    { label: "Promotions", href: "/admin/promotions", icon: Megaphone },
    { label: "Banners", href: "/admin/banners", icon: Image },
    { label: "Hero Slides", href: "/admin/hero-slides", icon: Presentation },
    { label: "Bundle Offers", href: "/admin/bundle-offers", icon: Package },
  ]},
  { group: "Content", items: [
    { label: "Blog Posts", href: "/admin/blogs", icon: FileText },
    { label: "About Page", href: "/admin/about-content", icon: Milestone },
    { label: "Homepage Layout", href: "/admin/home-layout", icon: LayoutTemplate },
    { label: "SEO", href: "/admin/seo", icon: Search },
    { label: "Media Library", href: "/admin/media", icon: FolderOpen },
    { label: "CMS Pages", href: "/admin/cms", icon: Globe },
  ]},
  { group: "System", items: [
    { label: "Activity Logs", href: "/admin/activity-logs", icon: ScrollText },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Roles & Permissions", href: "/admin/roles", icon: Shield },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]},
];

interface AdminSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ mobile = false, onNavigate }: AdminSidebarProps) {
  const brand = useBrand();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [collapsedDesktop, setCollapsedDesktop] = useState(false);
  const [navCounts, setNavCounts] = useState<AdminNavCounts>({ orders: 0, pendingBookings: 0, contactMessages: 0 });
  const collapsed = mobile ? false : collapsedDesktop;

  useEffect(() => {
    api.adminNavCounts().then((res) => {
      if (res.success && res.data) setNavCounts(res.data);
    });
  }, [pathname]);

  const handleLogout = async () => {
    await logout({ redirectTo: "/admin/login" });
  };

  return (
    <aside className={cn(
      "flex flex-col bg-brand-dark border-r border-white/10 transition-all duration-300 shrink-0",
      mobile ? "h-full w-full min-h-0" : collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-white/10 shrink-0", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <LogoMark size="sm" />
            <div className="min-w-0">
              <p className="text-white font-black text-xs leading-tight truncate">{brand.name}</p>
              <p className="text-gray-400 text-[10px] leading-tight">Admin Panel</p>
            </div>
          </Link>
        )}
        {collapsed && <LogoMark size="sm" />}
        {!mobile && (
          <button onClick={() => setCollapsedDesktop(!collapsedDesktop)}
            className="h-6 w-6 rounded-md text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-4">
        {navItems.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1">{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                      active
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/10",
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {!collapsed && "countKey" in item && item.countKey && navCounts[item.countKey] > 0 && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center", active ? "bg-white/20 text-white" : "bg-primary text-white")}>
                        {navCounts[item.countKey]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-white/10 p-3", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || "Admin"}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || "admin@autozone.pk"}</p>
            </div>
            <button type="button" onClick={handleLogout} className="text-gray-400 hover:text-white p-1 rounded transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">A</div>
        )}
      </div>
    </aside>
  );
}
