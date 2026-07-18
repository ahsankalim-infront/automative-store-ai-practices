"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Users, Package, FolderTree, Tag, Warehouse, Car, Wrench, Calendar, Ticket, Megaphone, Image, Star, FileText, BarChart3, Bell, Shield, Settings, ChevronLeft, ChevronRight, LogOut, Globe, FolderOpen, Mail, Search, LayoutTemplate, Milestone, Presentation, ScrollText, Layers,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { useBrand } from "@/lib/brand/brand-context";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import { ADMIN_NAV_GROUPS } from "@/lib/admin/nav";
import {
  canAccessAdminPath,
  getPermissionsForRole,
  type RolePermissionsConfig,
} from "@/lib/admin/role-permissions-defaults";
import type { AdminNavCounts } from "@/types";

const ICON_BY_HREF: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/analytics": BarChart3,
  "/admin/orders": ShoppingBag,
  "/admin/products": Package,
  "/admin/categories": FolderTree,
  "/admin/brands": Tag,
  "/admin/inventory": Warehouse,
  "/admin/customers": Users,
  "/admin/contact-messages": Mail,
  "/admin/reviews": Star,
  "/admin/vehicles": Car,
  "/admin/services": Wrench,
  "/admin/stores": Globe,
  "/admin/bookings": Calendar,
  "/admin/coupons": Ticket,
  "/admin/promotions": Megaphone,
  "/admin/banners": Image,
  "/admin/hero-slides": Presentation,
  "/admin/bundle-offers": Package,
  "/admin/blogs": FileText,
  "/admin/about-content": Milestone,
  "/admin/home-layout": LayoutTemplate,
  "/admin/seo": Search,
  "/admin/media": FolderOpen,
  "/admin/cms": Globe,
  "/admin/activity-logs": ScrollText,
  "/admin/cache": Layers,
  "/admin/reports": BarChart3,
  "/admin/notifications": Bell,
  "/admin/roles": Shield,
  "/admin/settings": Settings,
};

interface AdminSidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
  permissions?: RolePermissionsConfig | null;
}

export function AdminSidebar({ mobile = false, onNavigate, permissions }: AdminSidebarProps) {
  const brand = useBrand();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [collapsedDesktop, setCollapsedDesktop] = useState(false);
  const [navCounts, setNavCounts] = useState<AdminNavCounts>({ orders: 0, pendingBookings: 0, contactMessages: 0 });
  const collapsed = mobile ? false : collapsedDesktop;

  const allowed = useMemo(
    () => (permissions ? getPermissionsForRole(permissions, user?.role) : null),
    [permissions, user?.role]
  );

  const visibleGroups = useMemo(() => {
    // Wait for permissions so staff never briefly sees System links.
    if (!allowed) return [];
    return ADMIN_NAV_GROUPS
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => allowed.includes(item.href)),
      }))
      .filter((group) => group.items.length > 0);
  }, [allowed]);

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
          <Link href={allowed?.includes("/admin") ? "/admin" : (allowed?.[0] || "/admin")} className="flex items-center gap-2 min-w-0">
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
        {visibleGroups.map(group => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1">{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : canAccessAdminPath(pathname, [item.href]);
                const Icon = ICON_BY_HREF[item.href] || Package;
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
                    {!collapsed && item.countKey && navCounts[item.countKey] > 0 && (
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
              <p className="text-gray-400 text-xs truncate">
                {user?.role ? `${user.role}` : ""}{user?.email ? ` · ${user.email}` : ""}
              </p>
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
