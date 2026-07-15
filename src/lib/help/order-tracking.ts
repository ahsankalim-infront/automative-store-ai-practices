import type { Order, OrderStatus } from "@/types";

export interface PublicOrderTracking {
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingCity: string;
  itemCount: number;
  items: { productName: string; quantity: number }[];
  total: number;
  timeline: { key: string; label: string; done: boolean; active: boolean }[];
}

const TIMELINE: { key: OrderStatus | "placed"; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_RANK: Record<string, number> = {
  pending: 1,
  confirmed: 2,
  processing: 3,
  shipped: 4,
  out_for_delivery: 5,
  delivered: 6,
  cancelled: -1,
  returned: -1,
  refunded: -1,
};

const UNDELIVERED_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
];

export function isUndeliveredOrderStatus(status: OrderStatus): boolean {
  return UNDELIVERED_STATUSES.includes(status);
}

export function buildOrderTimeline(status: OrderStatus) {
  if (status === "cancelled" || status === "returned" || status === "refunded") {
    return [
      { key: "placed", label: "Order Placed", done: true, active: false },
      {
        key: status,
        label: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        done: true,
        active: true,
      },
    ];
  }

  const rank = STATUS_RANK[status] ?? 1;
  return TIMELINE.map((step, index) => {
    const stepRank = step.key === "placed" ? 1 : STATUS_RANK[step.key] ?? index;
    return {
      ...step,
      done: stepRank <= rank,
      active: stepRank === rank,
    };
  });
}

export function orderToPublicTracking(order: Order): PublicOrderTracking {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    estimatedDelivery: order.estimatedDelivery,
    trackingNumber: order.trackingNumber,
    shippingCity: order.shippingAddress.city,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    items: order.items.map((i) => ({ productName: i.productName, quantity: i.quantity })),
    total: order.total,
    timeline: buildOrderTimeline(order.status),
  };
}

export function normalizePhoneForMatch(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function phonesMatch(orderPhone: string, inputPhone: string): boolean {
  const a = normalizePhoneForMatch(orderPhone);
  const b = normalizePhoneForMatch(inputPhone);
  if (!a || !b || b.length < 10) return false;
  return a === b || a.endsWith(b.slice(-10)) || b.endsWith(a.slice(-10));
}
