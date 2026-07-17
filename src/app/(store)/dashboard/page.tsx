"use client";

import Link from "next/link";
import { Package, Heart, Calendar, Star, Truck, ShoppingBag, Wrench, ArrowRight } from "lucide-react";
import { useOrders, useBookings } from "@/hooks/use-api-data";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, formatDate } from "@/lib/utils";
import { useBrand } from "@/lib/brand/brand-context";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

const quickActions = [
  { label: "Shop Products", href: "/products", icon: ShoppingBag, desc: "Browse catalog" },
  { label: "Book Service", href: "/services/book", icon: Wrench, desc: "PPF & detailing" },
  { label: "My Wishlist", href: "/dashboard/wishlist", icon: Heart, desc: "Saved items" },
  { label: "Track Orders", href: "/dashboard/orders", icon: Package, desc: "Order history" },
];

export default function DashboardPage() {
  const brand = useBrand();
  const { data: orders = [], loading: ordersLoading } = useOrders();
  const { data: bookings = [] } = useBookings();
  const { items: wishItems } = useWishlistStore();
  const user = useAuthStore((s) => s.user);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-PK", { month: "short", year: "numeric" })
    : null;

  const stats = [
    { label: "Orders", value: orders.length, href: "/dashboard/orders" },
    { label: "Wishlist", value: wishItems.length, href: "/dashboard/wishlist" },
    { label: "Bookings", value: bookings.length, href: "/dashboard/bookings" },
    { label: "Points", value: user?.loyaltyPoints ?? 0, href: "/dashboard/profile" },
  ];

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-secondary to-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #D50000, transparent 50%)" }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Welcome back</p>
            <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name || "Customer"}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {memberSince ? `Member since ${memberSince}` : `${brand.name} customer`}
              {user?.phone ? ` · ${user.phone}` : ""}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {stats.map((s) => (
              <Link key={s.label} href={s.href} className="text-center rounded-xl bg-white/5 hover:bg-white/10 px-2 py-2 transition-colors">
                <p className="text-lg sm:text-2xl font-black text-primary">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">{s.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col gap-2 bg-card rounded-2xl border border-border p-4 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <ActionIcon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-gray-400">{action.desc}</p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-foreground">Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/dashboard/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {ordersLoading ? (
          <p className="text-sm text-gray-500 py-8 text-center">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={{ label: "Start Shopping", href: "/products" }}
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-4 sm:p-5">
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-foreground text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)} · {order.items.length} items</p>
                  </div>
                  <OrderStatusBadge status={order.status} uppercase />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
                  {order.items.slice(0, 2).map((item) => (
                    <span key={item.id} className="line-clamp-1">{item.productName}</span>
                  ))}
                  {order.items.length > 2 && <span className="text-gray-400">+{order.items.length - 2} more</span>}
                </div>
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                  <span className="text-base font-bold text-primary">{formatPrice(order.total)}</span>
                  <div className="flex flex-wrap gap-2">
                    {order.status === "shipped" && (
                      <Button size="xs" variant="outline" leftIcon={<Truck className="h-3 w-3" />}>Track</Button>
                    )}
                    <Button asChild size="xs" variant="ghost">
                      <Link href="/dashboard/orders">Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming bookings teaser */}
      {bookings.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Bookings
            </h2>
            <Link href="/dashboard/bookings" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 2).map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm py-2 border-b border-border last:border-0">
                <span className="font-medium text-foreground">{b.serviceName}</span>
                <span className="text-gray-400">{b.date} · {b.timeSlot}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.isVerified && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3 border border-green-100 dark:border-green-900/30">
          <Star className="h-4 w-4 shrink-0" />
          Verified account — enjoy faster checkout and exclusive offers.
        </div>
      )}
    </div>
  );
}
