import {
  createOrder as saveOrder,
  getCouponByCode,
  updateCoupon,
  getStoreSettings,
  getProductById,
  updateProduct,
} from "@/lib/data/repositories";
import { isProductSellable } from "@/lib/products/stock";
import type { CartItem } from "@/types";
import type { Order, OrderItem, ShippingAddress } from "@/types";

export interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: Order["paymentMethod"];
  couponCode?: string;
  notes?: string;
  shippingCost?: number;
}

export async function createOrderFromCart(input: CreateOrderInput): Promise<Order> {
  for (const item of input.items) {
    const product = await getProductById(item.productId);
    if (!product || !isProductSellable(product)) {
      throw new Error(`${item.name} is sold out`);
    }
    if (item.quantity > product.stock) {
      throw new Error(`Only ${product.stock} unit(s) of ${item.name} available`);
    }
  }

  const orderItems: OrderItem[] = input.items.map((item) => ({
    id: crypto.randomUUID(),
    productId: item.productId,
    productName: item.name,
    productImage: item.image,
    productSlug: item.slug,
    sku: item.slug,
    quantity: item.quantity,
    price: item.price,
    originalPrice: item.originalPrice,
    variant: item.variant,
    installationRequested: item.installationRequested,
    installationPrice: item.installationPrice,
  }));

  const subtotal = orderItems.reduce(
    (s, i) => s + i.price * i.quantity + (i.installationPrice || 0),
    0
  );

  let discount = 0;
  if (input.couponCode) {
    const coupon = await getCouponByCode(input.couponCode);
    if (coupon && coupon.isActive) {
      const now = new Date();
      if (new Date(coupon.validFrom) <= now && new Date(coupon.validTo) >= now) {
        if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
          if (coupon.type === "fixed") discount = coupon.value;
          else if (coupon.type === "percentage") {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
          }
          await updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
        }
      }
    }
  }

  const settings = await getStoreSettings();
  const shippingCost =
    input.shippingCost ??
    (subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShipping);
  const total = Math.max(0, subtotal + shippingCost - discount);

  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: `${settings.orderPrefix}-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    userId: input.userId,
    items: orderItems,
    subtotal,
    shippingCost,
    discount,
    tax: 0,
    total,
    status: "pending",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "cod" ? "pending" : "paid",
    shippingAddress: input.shippingAddress,
    couponCode: input.couponCode,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const saved = await saveOrder(order);

  // Decrement stock; products with stock <= 0 become sold out via normalizeProductAvailability
  for (const item of input.items) {
    const product = await getProductById(item.productId);
    if (!product) continue;
    const nextStock = Math.max(0, product.stock - item.quantity);
    await updateProduct(product.id, {
      stock: nextStock,
      inStock: nextStock > 0,
    });
  }

  return saved;
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await getCouponByCode(code);
  if (!coupon) return { valid: false, message: "Invalid coupon code" };
  if (!coupon.isActive) return { valid: false, message: "Coupon is inactive" };

  const now = new Date();
  if (new Date(coupon.validFrom) > now || new Date(coupon.validTo) < now) {
    return { valid: false, message: "Coupon has expired" };
  }
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return { valid: false, message: `Minimum order Rs. ${coupon.minOrderAmount} required` };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  let discount = 0;
  if (coupon.type === "fixed") discount = coupon.value;
  else if (coupon.type === "percentage") {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  }

  return { valid: true, discount, coupon };
}
