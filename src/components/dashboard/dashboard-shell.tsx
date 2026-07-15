"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DASHBOARD_NAV, getDashboardTitle } from "@/lib/dashboard/nav";
import { useAuthStore } from "@/store/auth-store";
import { useOrders, useBookings } from "@/hooks/use-api-data";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/logo";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const { data: orders = [] } = useOrders();
  const { data: bookings = [] } = useBookings();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const counts: Record<string, number> = {
    orders: orders.length,
    wishlist: wishlistCount,
    bookings: bookings.length,
  };

  const handleLogout = async () => {
    await logout({ redirectTo: "/auth/login" });
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1">
      {DASHBOARD_NAV.map((item) => {
        const active = pathname === item.href;
        const count = item.countKey ? counts[item.countKey] : 0;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              active
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-gray-600 dark:text-gray-400 hover:bg-surface hover:text-secondary dark:hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-primary")} />
            <span className="flex-1 truncate">{item.label}</span>
            {count > 0 && (
              <Badge variant={active ? "ghost" : "primary"} className="text-[10px] min-w-[1.25rem] justify-center">
                {count}
              </Badge>
            )}
            {!active && <ChevronRight className="h-3.5 w-3.5 opacity-40 shrink-0 hidden lg:block" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="h-9 w-9 rounded-xl flex items-center justify-center border border-border text-gray-600 dark:text-gray-400"
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <BrandLogo size="sm" showText={false} className="mb-0.5" />
            <p className="text-sm font-bold text-foreground truncate">{getDashboardTitle(pathname)}</p>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Horizontal quick tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {DASHBOARD_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap",
                  active
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 flex"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} aria-hidden />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="relative h-full w-[min(18rem,calc(100vw-1rem))] max-w-[88vw] bg-card shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <BrandLogo size="sm" textClassName="[&_p:last-child]:hidden" />
                  <button type="button" onClick={() => setMobileNavOpen(false)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-surface shrink-0">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{user?.name || "Customer"}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <NavLinks onNavigate={() => setMobileNavOpen(false)} />
              </div>
              <div className="p-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0">
            <div className="sticky top-24 space-y-4">
              <BrandLogo size="sm" className="px-1" />
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">{user?.name || "Customer"}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <NavLinks />
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-orange-500/5 rounded-2xl border border-primary/20 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">Need help?</p>
                <p className="text-xs text-gray-500 mb-3">Browse products or book a service anytime.</p>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" variant="primary" fullWidth>
                    <Link href="/products">Shop Products</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" fullWidth>
                    <Link href="/services/book">Book Service</Link>
                  </Button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
