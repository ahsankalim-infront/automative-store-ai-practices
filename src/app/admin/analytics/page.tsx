"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Package,
  Wallet,
  Star,
  Calendar,
  Mail,
  RefreshCw,
  Filter,
  X,
  Percent,
  Truck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import type {
  AdminDashboardData,
  AnalyticsBreakdownItem,
  DashboardStats,
  SalesDataPoint,
  TopProduct,
  OrderStatusBreakdown,
} from "@/types";

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
];

const selectClass =
  "px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

export default function AdminAnalyticsPage() {
  const chart = useChartTheme();
  const [period, setPeriod] = useState("30");
  const [status, setStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusBreakdown[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<AnalyticsBreakdownItem[]>([]);
  const [categorySales, setCategorySales] = useState<AnalyticsBreakdownItem[]>([]);
  const [citySales, setCitySales] = useState<AnalyticsBreakdownItem[]>([]);
  const [bookingStatus, setBookingStatus] = useState<AnalyticsBreakdownItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<
    NonNullable<AdminDashboardData["filterOptions"]>
  >({ categories: [], paymentMethods: [], statuses: [] });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.adminStats({ period, status, paymentMethod, category });
    if (res.success && res.data) {
      setStats(res.data.stats);
      setSalesData(res.data.salesData);
      setTopProducts(res.data.topProducts);
      setOrderStatusData(res.data.orderStatusBreakdown);
      setPaymentBreakdown(res.data.paymentMethodBreakdown ?? []);
      setCategorySales(res.data.categorySales ?? []);
      setCitySales(res.data.citySales ?? []);
      setBookingStatus(res.data.bookingStatusBreakdown ?? []);
      if (res.data.filterOptions) setFilterOptions(res.data.filterOptions);
    }
    setLoading(false);
  }, [period, status, paymentMethod, category]);

  useEffect(() => {
    load();
  }, [load]);

  const hasFilters =
    period !== "all" || status !== "all" || paymentMethod !== "all" || category !== "all";

  const clearFilters = () => {
    setPeriod("all");
    setStatus("all");
    setPaymentMethod("all");
    setCategory("all");
  };

  const periodLabel = PERIOD_OPTIONS.find((p) => p.value === period)?.label ?? "All time";

  const primaryCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: "Revenue",
        value: formatPrice(stats.totalRevenue),
        growth: stats.revenueGrowth,
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        label: "Orders",
        value: stats.totalOrders.toLocaleString(),
        growth: stats.ordersGrowth,
        icon: ShoppingBag,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        label: "Avg order value",
        value: formatPrice(stats.averageOrderValue ?? 0),
        growth: 0,
        icon: Wallet,
        color: "text-emerald-600",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      },
      {
        label: "Customers",
        value: stats.totalCustomers.toLocaleString(),
        growth: stats.customersGrowth,
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-50 dark:bg-purple-900/20",
      },
    ];
  }, [stats]);

  const secondaryCards = useMemo(() => {
    if (!stats) return [];
    return [
      { label: "Paid orders", value: (stats.paidOrders ?? 0).toLocaleString(), icon: Wallet },
      { label: "Cancelled / refunded", value: (stats.cancelledOrders ?? 0).toLocaleString(), icon: X },
      { label: "Discounts given", value: formatPrice(stats.totalDiscount ?? 0), icon: Percent },
      { label: "Shipping collected", value: formatPrice(stats.totalShipping ?? 0), icon: Truck },
      { label: "Bookings", value: (stats.totalBookings ?? 0).toLocaleString(), icon: Calendar },
      {
        label: "Completed bookings",
        value: (stats.completedBookings ?? 0).toLocaleString(),
        icon: Calendar,
      },
      {
        label: "Reviews",
        value: `${stats.totalReviews ?? 0} · ★ ${stats.averageRating ?? 0}`,
        icon: Star,
      },
      {
        label: "Contact messages",
        value: (stats.contactMessages ?? 0).toLocaleString(),
        icon: Mail,
      },
      {
        label: "Low stock SKUs",
        value: stats.lowStockProducts.toLocaleString(),
        icon: Package,
      },
      {
        label: "Pending orders",
        value: stats.pendingOrders.toLocaleString(),
        icon: ShoppingBag,
      },
    ];
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-500">Failed to load analytics.</p>;
  }

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Store performance · {periodLabel}
            {hasFilters ? " · filtered" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
            onClick={load}
            disabled={loading}
          >
            Refresh
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-bold text-foreground">Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <label className="space-y-1">
            <span className="text-xs text-gray-500">Period</span>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className={`w-full ${selectClass}`}>
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-gray-500">Order status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`w-full ${selectClass}`}>
              <option value="all">All statuses</option>
              {filterOptions.statuses.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-gray-500">Payment method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={`w-full ${selectClass}`}
            >
              <option value="all">All methods</option>
              {filterOptions.paymentMethods.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs text-gray-500">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full ${selectClass}`}>
              <option value="all">All categories</option>
              {filterOptions.categories.map((o) => (
                <option key={o.slug} value={o.slug}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} padding="md">
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.growth !== 0 && (
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold ${
                      stat.growth > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {stat.growth > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.growth)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-foreground mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {secondaryCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="md" className="!p-3">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[11px]">{s.label}</span>
              </div>
              <p className="text-base font-bold text-foreground">{s.value}</p>
            </Card>
          );
        })}
      </div>

      {/* Revenue + Orders charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground">Revenue trend</h3>
              <p className="text-xs text-gray-400">{periodLabel}</p>
            </div>
            {stats.revenueGrowth !== 0 && (
              <Badge variant={stats.revenueGrowth > 0 ? "success" : "danger"}>
                {stats.revenueGrowth > 0 ? "+" : ""}
                {stats.revenueGrowth}% vs last month
              </Badge>
            )}
          </div>
          <div className="p-5">
            {salesData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No sales data for this filter.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: chart.tick }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={chart.tooltip} />
                  <Area type="monotone" dataKey="revenue" stroke="#D50000" fill="#D5000020" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Orders trend</h3>
            <p className="text-xs text-gray-400">{periodLabel}</p>
          </div>
          <div className="p-5">
            {salesData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No order data for this filter.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: chart.tick }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={chart.tooltip} />
                  <Bar dataKey="orders" fill="#D50000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Status + Payment pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Order status mix</h3>
            <p className="text-xs text-gray-400">Filtered orders</p>
          </div>
          <div className="p-5">
            {orderStatusData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No orders.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {orderStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: chart.tick }}>{value}</span>
                    )}
                  />
                  <Tooltip contentStyle={chart.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Payment methods</h3>
            <p className="text-xs text-gray-400">Order count by method</p>
          </div>
          <div className="p-5">
            {paymentBreakdown.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No payment data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {paymentBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color || "#6B7280"} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11, color: chart.tick }}>{value}</span>
                    )}
                  />
                  <Tooltip
                    formatter={(v, _n, item) => {
                      const rev = (item?.payload as AnalyticsBreakdownItem | undefined)?.revenue;
                      return [
                        `${Number(v).toLocaleString()} orders${rev != null ? ` · ${formatPrice(rev)}` : ""}`,
                        "Count",
                      ];
                    }}
                    contentStyle={chart.tooltip}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Category + City bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Sales by category</h3>
            <p className="text-xs text-gray-400">Revenue from line items</p>
          </div>
          <div className="p-5">
            {categorySales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No category sales.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categorySales} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: chart.tick }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 10, fill: chart.tick }}
                  />
                  <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={chart.tooltip} />
                  <Bar dataKey="revenue" fill="#D50000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-foreground">Top cities</h3>
            <p className="text-xs text-gray-400">Shipping address city</p>
          </div>
          <div className="p-5">
            {citySales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No city data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={citySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: chart.tick }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: chart.tick }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={chart.tooltip} />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Top products + Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Top products</h3>
              <p className="text-xs text-gray-400">By revenue · {topProducts.length} shown</p>
            </div>
            <Link href="/admin/products" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No products for this filter.</p>
            ) : (
              topProducts.map((product, i) => (
                <div key={product.id} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <div className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 overflow-hidden relative">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="36px" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.sales} sold</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">
                    {formatPrice(product.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">Service bookings</h3>
              <p className="text-xs text-gray-400">Status mix for period</p>
            </div>
            <Link href="/admin/bookings" className="text-xs text-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="p-5">
            {bookingStatus.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-16">No bookings in this period.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={bookingStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {bookingStatus.map((entry, i) => (
                        <Cell key={i} fill={entry.color || "#6B7280"} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chart.tooltip} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 space-y-1.5">
                  {bookingStatus.map((b) => (
                    <div key={b.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{b.name}</span>
                      <span className="font-semibold text-foreground">{b.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
