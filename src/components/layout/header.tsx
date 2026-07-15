"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Phone, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MegaMenu } from "./mega-menu";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore, useIsAdmin } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/logo";
import { useMobileStoreNav } from "@/components/layout/mobile-store-nav";
import { BRAND, formatPhoneDisplay, phoneTelHref } from "@/lib/brand/config";
import type { Product, Category } from "@/types";

export function Header({ categories = [] }: { categories?: Category[] }) {
  const mobileNav = useMobileStoreNav();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`
        );
        const json = await res.json();
        if (json.success && json.data) setSearchResults(json.data as Product[]);
        else setSearchResults([]);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
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
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-md"
          : "bg-white dark:bg-gray-950 border-b border-border"
      )}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0 min-w-0">
              <BrandLogo
                size="md"
                priority
                className="max-w-[min(100%,11rem)] sm:max-w-none"
                textClassName="[&_p:last-child]:hidden sm:[&_p:last-child]:block"
              />
            </Link>

            {/* Mega Menu */}
            <div className="hidden lg:flex flex-1 items-center justify-center">
              <MegaMenu categories={categories} />
            </div>

            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 lg:max-w-xs relative hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border shadow-xl z-50 max-h-[min(60dvh,420px)] overflow-y-auto overscroll-contain"
                  >
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category} · {formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/products?q=${searchQuery}`}
                      onClick={() => { setSearchOpen(false); }}
                      className="block px-4 py-3 text-sm text-primary font-medium border-t border-border hover:bg-gray-50 transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone — desktop */}
            <a
              href={phoneTelHref(BRAND.primaryPhone)}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-primary transition-colors shrink-0"
            >
              <Phone className="h-4 w-4 text-primary" />
              {formatPhoneDisplay(BRAND.primaryPhone)}
            </a>

            {/* Icons */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search toggle */}
              <button
                onClick={() => { setSearchOpen(!searchOpen); }}
                className="sm:hidden h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
                aria-label="Search"
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>

              <Link href="/dashboard/wishlist" className="relative h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors">
                <Heart className="h-5 w-5" />
                {wishItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {wishItems.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors">
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
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", userMenuOpen && "rotate-180")} />
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
                  <Link href="/auth/login" className="h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors">
                    <User className="h-5 w-5" />
                  </Link>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchOpen(false);
                  mobileNav?.openDrawer("menu");
                }}
                className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-surface transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar — appears below header when search icon is tapped */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-border bg-white dark:bg-gray-950 overflow-hidden"
            >
              <div ref={searchRef} className="px-4 py-3 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-4 right-4 mt-1 bg-card rounded-xl border border-border shadow-xl z-50 max-h-[min(50dvh,360px)] overflow-y-auto overscroll-contain">
                    {searchResults.map(product => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-border last:border-0"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category} · {formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                    <Link href={`/products?q=${searchQuery}`} onClick={() => setSearchOpen(false)}
                      className="block px-4 py-3 text-sm text-primary font-medium border-t border-border">
                      View all results →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
