"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";
import type { DashboardStats, SalesDataPoint } from "@/types";

export default function AdminAnalyticsPage() {
  const chart = useChartTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);

  useEffect(() => {
    api.adminStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data.stats);
        setSalesData(res.data.salesData);
      }
    });
  }, []);

  if (!stats) return <p className="text-gray-500">Loading analytics...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-foreground">Analytics</h1>
        <p className="text-sm text-gray-500">Store performance overview</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Revenue", value: formatPrice(stats.totalRevenue) },
          { label: "Orders", value: stats.totalOrders.toLocaleString() },
          { label: "Customers", value: stats.totalCustomers.toLocaleString() },
          { label: "Products", value: stats.totalProducts.toLocaleString() },
        ].map((s) => (
          <Card key={s.label} padding="md">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-black text-foreground mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card padding="md">
        <h3 className="font-bold text-foreground mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: chart.tick }} />
            <YAxis tick={{ fontSize: 12, fill: chart.tick }} />
            <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={chart.tooltip} />
            <Area type="monotone" dataKey="revenue" stroke="#D50000" fill="#D5000020" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card padding="md">
        <h3 className="font-bold text-foreground mb-4">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: chart.tick }} />
            <YAxis tick={{ fontSize: 12, fill: chart.tick }} />
            <Tooltip contentStyle={chart.tooltip} />
            <Bar dataKey="orders" fill="#D50000" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
