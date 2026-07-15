"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  TrendingUp, TrendingDown, ShoppingBag, Users, Package, Warehouse,
  ArrowRight, Clock, CheckCircle, Search, RefreshCw, Filter, X,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import { formatPrice, formatDate } from "@/lib/utils";
import type {
  DashboardStats, Order, SalesDataPoint, TopProduct,
  OrderStatusBreakdown,
} from "@/types";

import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

function statsCards(stats: DashboardStats) {
  return [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), growth: stats.revenueGrowth, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), growth: stats.ordersGrowth, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Customers", value: stats.totalCustomers.toLocaleString(), growth: stats.customersGrowth, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Products", value: stats.totalProducts.toLocaleString(), growth: 0, icon: Package, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ];
}

export default function AdminDashboard() {
  const chart = useChartTheme();
  const [period, setPeriod] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusBreakdown[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.adminStats(period === "all" ? undefined : period);
    if (res.success && res.data) {
      setStats(res.data.stats);
      setSalesData(res.data.salesData);
      setTopProducts(res.data.topProducts);
      setOrderStatusData(res.data.orderStatusBreakdown);
      setRecentOrders(res.data.recentOrders);
    }
    setLoading(false);
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const filteredOrders = useMemo(() => {
    let list = recentOrders;
    if (orderStatus !== "all") list = list.filter((o) => o.status === orderStatus);
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingAddress.fullName.toLowerCase().includes(q) ||
          o.items.some((i) => i.productName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [recentOrders, orderSearch, orderStatus]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return topProducts;
    const q = productSearch.toLowerCase();
    return topProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [topProducts, productSearch]);

  const hasActiveFilters = orderSearch.trim() || orderStatus !== "all" || productSearch.trim();

  const clearFilters = () => {
    setOrderSearch("");
    setOrderStatus("all");
    setProductSearch("");
  };

  if (loading && !stats) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-500">Failed to load dashboard data.</p>;
  }

  const cards = statsCards(stats);
  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "All time";

  return (
    <div className="space-y-6 max-w-full">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Live store metrics · {periodLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />} onClick={load} disabled={loading}>
            Refresh
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((stat) => {
          const StatIcon = stat.icon;
          return (
          <Card key={stat.label} padding="md">
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <StatIcon className={`h-5 w-5 ${stat.color}`} />
              </div>
              {stat.growth !== 0 && (
                <span className={`flex items-center gap-1 text-xs font-semibold ${stat.growth > 0 ? "text-green-600" : "text-red-500"}`}>
                  {stat.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(stat.growth)}%
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </Card>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Clock, label: "Pending Orders", value: stats.pendingOrders, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800", href: "/admin/orders?status=pending" },
          { icon: Warehouse, label: "Low Stock Products", value: stats.lowStockProducts, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", href: "/admin/inventory" },
          { icon: CheckCircle, label: "Pending Bookings", value: stats.pendingBookings, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", href: "/admin/bookings?status=pending" },
        ].map((alert) => {
          const AlertIcon = alert.icon;
          return (
          <Link key={alert.label} href={alert.href}
            className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border ${alert.bg} hover:shadow-md transition-all`}>
            <AlertIcon className={`h-5 w-5 ${alert.color} shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className={`text-lg font-black ${alert.color}`}>{alert.value}</p>
              <p className="text-xs text-gray-500 truncate">{alert.label}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
          </Link>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-foreground">Revenue & Orders</h3>
              <p className="text-xs text-gray-400">{periodLabel}</p>
            </div>
            {stats.revenueGrowth !== 0 && (
              <Badge variant={stats.revenueGrowth > 0 ? "success" : "danger"}>
                {stats.revenueGrowth > 0 ? "+" : ""}{stats.revenueGrowth}% vs last month
              </Badge>
            )}
          </div>
          <div className="p-5">
            {salesData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No sales data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => [`Rs.${Number(value).toLocaleString()}`, "Revenue"]} contentStyle={chart.tooltip} />
                  <Area type="monotone" dataKey="revenue" stroke="#D50000" strokeWidth={2.5} fill="url(#revenueGrad)" />
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D50000" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D50000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Order Status</h3>
            <p className="text-xs text-gray-400">{periodLabel} · from live orders</p>
          </div>
          <div className="p-5">
            {orderStatusData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No orders in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {orderStatusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: chart.tick }}>{value}</span>} />
                  <Tooltip formatter={(v) => [Number(v).toLocaleString(), "Orders"]} contentStyle={chart.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Orders + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-4 sm:p-5 border-b border-border space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-foreground">Recent Orders</h3>
              <Link href="/admin/orders" className="text-xs text-primary hover:underline font-medium shrink-0">View All</Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search order, customer, product..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-400">{filteredOrders.length} of {recentOrders.length} orders</p>
          </div>
          <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10 px-4">No orders match your filters.</p>
            ) : (
              filteredOrders.slice(0, 20).map((order) => (
                <Link key={order.id} href="/admin/orders"
                  className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 hover:bg-surface transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 truncate">{order.shippingAddress.fullName} · {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-4 sm:p-5 border-b border-border space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-foreground">Top Products</h3>
              <Link href="/admin/products" className="text-xs text-primary hover:underline font-medium shrink-0">View All</Link>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-gray-400">{filteredProducts.length} products · ranked by revenue</p>
          </div>
          <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10 px-4">No products match your search.</p>
            ) : (
              filteredProducts.map((product, i) => (
                <div key={product.id} className="px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-surface transition-colors">
                  <span className="text-xs font-bold text-gray-400 w-5 shrink-0">{i + 1}</span>
                  <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden relative">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="36px" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sales} sold</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">{formatPrice(product.revenue)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Orders volume bar */}
      <Card padding="none">
        <div className="p-5 border-b border-border">
          <h3 className="font-bold text-foreground">Orders Volume</h3>
          <p className="text-xs text-gray-400">{periodLabel}</p>
        </div>
        <div className="p-5">
          {salesData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No order volume data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={chart.tooltip} />
                <Bar dataKey="orders" fill="#D50000" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
