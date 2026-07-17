"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Search, Truck, CheckCircle, Clock, MapPin, Loader2 } from "lucide-react";
import { HelpPageHero, HelpSidebar } from "@/components/help/help-page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay } from "@/lib/brand/config";
import { TRACK_ORDER_STEPS } from "@/lib/help/content";
import type { PublicOrderTracking } from "@/lib/help/order-tracking";

function OrderTrackingCard({ result }: { result: PublicOrderTracking }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Order</p>
          <p className="text-xl font-black text-foreground">{result.orderNumber}</p>
          <p className="text-xs text-gray-500 mt-1">Placed {formatDate(result.createdAt)}</p>
        </div>
        <OrderStatusBadge status={result.status} uppercase />
      </div>

      <div className="p-6 border-b border-border">
        <p className="text-sm font-bold text-foreground mb-4">Delivery progress</p>
        <div className="space-y-4">
          {result.timeline.map((step) => (
            <div key={step.key} className="flex items-start gap-3">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  step.done
                    ? step.active
                      ? "bg-primary text-white"
                      : "bg-green-100 text-green-600 dark:bg-green-900/30"
                    : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                }`}
              >
                {step.done ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${step.active ? "text-primary" : "text-foreground"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">Destination</p>
            <p className="text-gray-500">{result.shippingCity}</p>
          </div>
        </div>
        {result.trackingNumber && (
          <div className="flex items-start gap-2">
            <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Courier tracking</p>
              <p className="text-gray-500 font-mono text-xs">{result.trackingNumber}</p>
            </div>
          </div>
        )}
        {result.estimatedDelivery && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Estimated delivery</p>
              <p className="text-gray-500">{result.estimatedDelivery}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <p className="text-sm font-bold text-foreground mb-3">Items ({result.itemCount})</p>
        <ul className="space-y-2">
          {result.items.map((item, idx) => (
            <li key={`${item.productName}-${idx}`} className="flex justify-between text-sm gap-3">
              <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{item.productName}</span>
              <span className="text-gray-400 shrink-0">×{item.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="text-right text-base font-bold text-primary mt-4">Total {formatPrice(result.total)}</p>
      </div>
    </div>
  );
}

export default function TrackOrderClient() {
  const brand = useBrand();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<PublicOrderTracking[]>([]);
  const [resultMode, setResultMode] = useState<"active" | "specific" | "order" | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setResultMode(null);

    if (!phone.trim() && !orderNumber.trim()) {
      setError("Enter an order number or phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          ...(orderNumber.trim() ? { orderNumber: orderNumber.trim() } : {}),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "No orders found");
        return;
      }
      setResults(json.data.orders as PublicOrderTracking[]);
      setResultMode(json.data.mode as "active" | "specific" | "order");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HelpPageHero
        icon={Package}
        title="Track Your Order"
        description={`Enter your order number or phone number to see order status from ${brand.name}.`}
        breadcrumb="Track Order"
      />

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[16rem_1fr] gap-8 items-start">
          <HelpSidebar activeHref="/track-order" />

          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {TRACK_ORDER_STEPS.map((step, i) => (
                <div key={step.title} className="bg-card rounded-2xl border border-border p-4">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center mb-2">
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-foreground">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleTrack}
              className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-4"
            >
              <div>
                <h2 className="text-lg font-bold text-foreground">Look up an order</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter an <strong className="text-foreground">order number</strong> to track that order, or your{" "}
                  <strong className="text-foreground">phone number</strong> to see active orders not yet delivered.
                  You can use either field — both are optional, but at least one is required.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Order Number"
                  placeholder={`e.g. ${brand.orderPrefix}-2026-001234 or AZ-2026-001235`}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
                <Input
                  label="Phone Number (optional)"
                  placeholder={`e.g. ${formatPhoneDisplay(brand.primaryPhone)}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Track Order"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/orders">View all orders in account</Link>
                </Button>
              </div>
            </form>

            {results.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  {resultMode === "active" ? (
                    <>
                      Found <strong className="text-foreground">{results.length}</strong> active order
                      {results.length !== 1 ? "s" : ""} — newest first
                    </>
                  ) : (
                    <>Order details for <strong className="text-foreground">{results[0]?.orderNumber}</strong></>
                  )}
                </p>
                {results.map((result) => (
                  <OrderTrackingCard key={result.orderNumber} result={result} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
