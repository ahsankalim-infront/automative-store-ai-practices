"use client";

import Link from "next/link";
import { Package, Truck, CheckCircle, X, FileDown } from "lucide-react";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useOrders } from "@/hooks/use-api-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { downloadOrderSummaryPdf } from "@/lib/orders/download-order-summary-pdf";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/types";

const statusIcons: Partial<Record<OrderStatus, React.ReactNode>> = {
  delivered: <CheckCircle className="h-3.5 w-3.5" />,
  shipped: <Truck className="h-3.5 w-3.5" />,
  processing: <Package className="h-3.5 w-3.5" />,
  cancelled: <X className="h-3.5 w-3.5" />,
};

export default function UserOrdersPage() {
  const { data: orders = [], loading } = useOrders();

  const handlePdf = async (orderId: string, orderNumber: string) => {
    try {
      await downloadOrderSummaryPdf(orderId, orderNumber);
      toast.success("Order summary PDF downloaded");
    } catch {
      toast.error("Could not download PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground">My Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Track deliveries, reorder, or view order details.</p>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No orders yet"
          description="Your order history will appear here after your first purchase."
          action={{ label: "Browse Products", href: "/products" }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-2xl border border-border p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} uppercase>
                  <span className="flex items-center gap-1">
                    {statusIcons[order.status]}
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </OrderStatusBadge>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 py-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 hidden xs:block" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productSlug}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">{item.productName}</Link>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
                <span className="text-base font-bold text-foreground">
                  Total: <span className="text-primary">{formatPrice(order.total)}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FileDown className="h-3.5 w-3.5" />}
                    onClick={() => handlePdf(order.id, order.orderNumber)}
                  >
                    PDF Summary
                  </Button>
                  {order.status === "shipped" && (
                    <Button size="sm" variant="outline" leftIcon={<Truck className="h-3.5 w-3.5" />}>Track Order</Button>
                  )}
                  {order.status === "delivered" && (
                    <Button size="sm" variant="ghost">Write Review</Button>
                  )}
                  <Button size="sm" leftIcon={<Package className="h-3.5 w-3.5" />}>Reorder</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
