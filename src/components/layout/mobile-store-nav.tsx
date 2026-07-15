"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Wrench,
  Phone,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppImage as Image } from "@/components/ui/app-image";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/logo";
import { SIGNATURE_CATEGORY_SLUGS } from "@/lib/brand/signature-categories";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore, useIsAdmin } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export type MobileNavView = "menu" | "categories";

interface MobileNavContextValue {
  openDrawer: (view: MobileNavView) => void;
  closeDrawer: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function useMobileStoreNav() {
  return useContext(MobileNavContext);
}

const menuGroups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Custom Seat Covers", href: "/products?category=custom-seat-covers" },
      { label: "Car Top Cover", href: "/products?category=car-top-cover" },
      { label: "Car Floor Matting", href: "/products?category=car-floor-matting" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", href: "/services" },
      { label: "Book Appointment", href: "/services/book" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Store Locator", href: "/store-locator" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

function MobileBottomNav({
  onCategories,
  onMenu,
}: {
  onCategories: () => void;
  onMenu: () => void;
}) {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const items = [
    { key: "home", label: "Home", href: "/", icon: Home, match: (p: string) => p === "/" },
    { key: "categories", label: "Categories", icon: LayoutGrid, onClick: onCategories, match: () => false },
    { key: "shop", label: "Shop", href: "/products", icon: ShoppingBag, match: (p: string) => p.startsWith("/products") },
    { key: "cart", label: "Cart", href: "/cart", icon: ShoppingCart, match: (p: string) => p === "/cart", badge: cartCount },
    { key: "menu", label: "Menu", icon: Menu, onClick: onMenu, match: () => false },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-screen-xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match ? item.match(pathname) : false;
          const className = cn(
            "flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 transition-colors",
            active ? "text-primary" : "text-gray-500 dark:text-gray-400"
          );

          const inner = (
            <>
              <span className="relative">
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-0.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </span>
              <span className={cn("text-[10px] font-medium truncate max-w-full", active && "font-bold")}>
                {item.label}
              </span>
            </>
          );

          if (item.href) {
            return (
              <Link key={item.key} href={item.href} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <button key={item.key} type="button" onClick={item.onClick} className={className}>
              {inner}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MobileNavDrawer({
  open,
  view,
  categories,
  onClose,
}: {
  open: boolean;
  view: MobileNavView;
  categories: Category[];
  onClose: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleLogout = async () => {
    onClose();
    await logout({ redirectTo: isAdmin ? "/admin/login" : "/auth/login" });
  };

  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const featured = sorted.filter((c) =>
    (SIGNATURE_CATEGORY_SLUGS as readonly string[]).includes(c.slug)
  );
  const rest = sorted.filter(
    (c) => !(SIGNATURE_CATEGORY_SLUGS as readonly string[]).includes(c.slug)
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 360 }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-[70] max-h-[min(92dvh,720px)] flex flex-col rounded-t-3xl bg-card border-t border-border shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
            role="dialog"
            aria-modal="true"
            aria-label={view === "categories" ? "Categories" : "Menu"}
          >
            <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-border shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-black text-foreground">
                  {view === "categories" ? "Shop by Category" : "Browse Store"}
                </h2>
                <p className="text-xs text-gray-400 truncate">
                  {view === "categories"
                    ? "Tap a category to see products"
                    : "Products, services & more"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-surface text-gray-500 hover:text-foreground shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              {view === "categories" ? (
                <div className="space-y-5">
                  {featured.length > 0 && (
                    <section>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2.5">
                        Signature Lines
                      </p>
                      <div className="grid grid-cols-1 gap-2.5">
                        {featured.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2.5 rounded-2xl bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors"
                          >
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                              {cat.image ? (
                                <Image
                                  src={cat.image}
                                  alt={cat.name}
                                  fill
                                  className="object-cover"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-primary text-xs font-bold">
                                  {cat.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate">{cat.name}</p>
                              <p className="text-xs text-gray-400 line-clamp-1">
                                {cat.description || `${cat.productCount} products`}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                      All Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {rest.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="group flex flex-col rounded-2xl border border-border bg-surface/50 overflow-hidden hover:border-primary/30 transition-colors"
                        >
                          <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                            {cat.image ? (
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="160px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-primary/30">
                                {cat.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                              {cat.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{cat.productCount} items</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>

                  <Link
                    href="/products"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <BrandLogo size="sm" className="justify-center" />

                  {menuGroups.map((group) => (
                    <section key={group.title}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        {group.title}
                      </p>
                      <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            {link.label}
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        ))}
                      </div>
                    </section>
                  ))}

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/services/book"
                      onClick={onClose}
                      className="flex items-center gap-2 p-3 rounded-2xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary"
                    >
                      <Wrench className="h-4 w-4 shrink-0" />
                      Book Service
                    </Link>
                    <Link
                      href="/contact"
                      onClick={onClose}
                      className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-border text-sm font-semibold text-foreground"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      Contact
                    </Link>
                  </div>

                  <div className="pt-2 space-y-2">
                    {user ? (
                      <>
                        <Link href={isAdmin ? "/admin" : "/dashboard"} onClick={onClose}>
                          <Button variant="outline" fullWidth leftIcon={<LayoutDashboard className="h-4 w-4" />}>
                            {isAdmin ? "Admin Panel" : "My Dashboard"}
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          fullWidth
                          leftIcon={<LogOut className="h-4 w-4" />}
                          onClick={handleLogout}
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" onClick={onClose}>
                          <Button variant="outline" fullWidth leftIcon={<User className="h-4 w-4" />}>
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/register" onClick={onClose}>
                          <Button variant="primary" fullWidth>
                            Create Account
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function MobileStoreNavProvider({
  categories,
  children,
}: {
  categories: Category[];
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<MobileNavView>("menu");

  const openDrawer = useCallback((view: MobileNavView) => {
    setDrawerView(view);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <MobileNavContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <MobileBottomNav
        onCategories={() => openDrawer("categories")}
        onMenu={() => openDrawer("menu")}
      />
      <MobileNavDrawer
        open={drawerOpen}
        view={drawerView}
        categories={categories}
        onClose={closeDrawer}
      />
    </MobileNavContext.Provider>
  );
}
