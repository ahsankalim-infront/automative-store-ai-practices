"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, User, Menu, ChevronDown, Phone, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MegaMenu } from "./mega-menu";
import {
  HeaderSearchProvider,
  HeaderSearchDesktop,
  HeaderSearchMobileToggle,
  HeaderSearchMobilePanel,
} from "./header-search";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore, useIsAdmin } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/logo";
import { useMobileStoreNav } from "@/components/layout/mobile-store-nav";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/brand/config";
import type { Category } from "@/types";

export function Header({ categories = [] }: { categories?: Category[] }) {
  const brand = useBrand();
  const mobileNav = useMobileStoreNav();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { items: cartItems } = useCartStore();
  const { items: wishItems } = useWishlistStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useIsAdmin();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout({ redirectTo: isAdmin ? "/admin/login" : "/auth/login" });
  };

  return (
    <HeaderSearchProvider>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 overflow-visible",
          scrolled
            ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-md border-b border-border"
            : "bg-white dark:bg-gray-950 lg:border-b-0 border-b border-border"
        )}
      >
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 overflow-visible">
          {/* Row 1 — logo + search + actions (always one row on laptop+) */}
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 h-14 sm:h-16 min-w-0 overflow-visible">
            <Link href="/" className="shrink-0 min-w-0 max-w-[42%] xs:max-w-[48%] md:max-w-none lg:max-w-[11rem] xl:max-w-none">
              <BrandLogo
                size="md"
                priority
                className="max-w-[min(100%,11rem)] sm:max-w-none"
                textClassName="[&_p:last-child]:hidden sm:[&_p:last-child]:block lg:[&_p:last-child]:hidden xl:[&_p:last-child]:block"
              />
            </Link>

            <HeaderSearchDesktop />

            <a
              href={phoneTelHref(brand.primaryPhone)}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors shrink-0"
            >
              <Phone className="h-4 w-4 text-primary" />
              {formatPhoneDisplay(brand.primaryPhone)}
            </a>

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-auto">
              <HeaderSearchMobileToggle />

              <Link
                href="/dashboard/wishlist"
                className="relative h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
              >
                <Heart className="h-5 w-5" />
                {wishItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {wishItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative hidden sm:block" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex h-9 items-center gap-1.5 rounded-xl px-2 text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="menu"
                    >
                      <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform", userMenuOpen && "rotate-180")}
                      />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 top-full mt-1 w-52 bg-card rounded-xl border border-border shadow-xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                          <Link
                            href={isAdmin ? "/admin" : "/dashboard"}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            {isAdmin ? "Admin Panel" : "My Dashboard"}
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-border"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </Link>
                )}
              </div>

              <button
                onClick={() => mobileNav?.openDrawer("menu")}
                className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Row 2 — main nav (laptop / desktop) */}
          <div className="hidden lg:block border-t border-border/50 py-0.5 overflow-visible">
            <MegaMenu categories={categories} />
          </div>
        </div>

        <HeaderSearchMobilePanel />
      </header>
    </HeaderSearchProvider>
  );
}
