"use client";
import { useState } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { ShoppingCart, Trash2, Plus, Minus, Package, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, toggleInstallation, applyCoupon, removeCoupon, couponCode, couponDiscount, clearCart } = useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity + (i.installationRequested ? (i.installationPrice || 0) : 0), 0);
  const shipping = subtotal > 1500 ? 0 : 250;
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    const ok = await applyCoupon(couponInput);
    if (ok) toast.success("Coupon applied!");
    else toast.error("Invalid coupon code");
    setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10" />}
          title="Your cart is empty"
          description="Add some amazing products to your cart and come back here!"
          action={{ label: "Start Shopping", href: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: "Cart" }]} className="mb-5" />
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <Badge variant="primary">{items.reduce((s, i) => s + i.quantity, 0)} items</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card rounded-2xl border border-border p-4 flex gap-4"
                >
                  <Link href={`/products/${item.slug}`} className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image src={item.image || `https://placehold.co/80x80/f3f4f6/9ca3af?text=IMG`} alt={item.name} fill className="object-cover" sizes="80px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => { removeItem(item.productId, item.variant); toast.success("Removed from cart"); }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.variant && <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>}
                    {item.installationRequested && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <Package className="h-3 w-3" /> Installation included (+{formatPrice(item.installationPrice || 0)})
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-surface transition-colors">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="h-7 px-3 flex items-center text-sm font-semibold border-x border-border">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-surface transition-colors">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                        {item.originalPrice && <p className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5">
              <Trash2 className="h-4 w-4" /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              <h3 className="font-bold text-foreground text-base">Order Summary</h3>

              {/* Coupon */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code" onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <Button size="sm" onClick={handleApplyCoupon} variant="outline">Apply</Button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between mt-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                    <span>✓ {couponCode} applied</span>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline">Remove</button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Try: WELCOME500 · SAVE10 · FIRST20</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span><span>- {formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-foreground border-t border-border pt-2 mt-2">
                  <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add {formatPrice(1500 - subtotal)} more for free shipping</p>
              )}

              <Button asChild fullWidth size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-border p-4 text-xs text-gray-400 space-y-1.5">
              <p className="flex items-center gap-1.5">✓ Secure checkout with SSL encryption</p>
              <p className="flex items-center gap-1.5">✓ Cash on Delivery available nationwide</p>
              <p className="flex items-center gap-1.5">✓ Free 7-day returns on all products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
