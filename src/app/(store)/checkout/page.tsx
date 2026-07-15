"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { useRouter } from "next/navigation";
import {
  Lock, ChevronDown, ShieldCheck, Tag, Truck, CreditCard,
  MapPin, User, Package, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/logo";
import toast from "react-hot-toast";

const FREE_SHIPPING_THRESHOLD = 1500;

const shippingMethods = [
  { id: "standard", label: "Standard Delivery", desc: "3–5 business days nationwide", price: 100 },
  { id: "express", label: "Express Delivery", desc: "1–2 business days in major cities", price: 250 },
];

const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "Gilgit-Baltistan"];

const inputClass =
  "w-full px-4 py-3 text-sm border border-border rounded-xl bg-card dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

const labelClass = "block text-sm font-medium text-foreground mb-1.5";

function getShippingCost(subtotal: number, methodId: string): number {
  const method = shippingMethods.find((m) => m.id === methodId)!;
  if (method.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.price;
}

function CheckoutSection({
  step,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-start gap-4 px-5 sm:px-6 py-4 border-b border-border bg-gray-50/80 dark:bg-gray-900/40">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-0.5">
            Step {step}
          </p>
          <h2 className="text-base sm:text-lg font-bold text-foreground">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items, couponDiscount, couponCode, clearCart,
    applyCoupon, removeCoupon,
  } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [couponLoading, setCouponLoading] = useState(false);

  const [contact, setContact] = useState(user?.email ?? user?.phone ?? "");
  const [emailOffers, setEmailOffers] = useState(false);

  const [delivery, setDelivery] = useState({
    country: "Pakistan",
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    address: "",
    city: "",
    postalCode: "",
    phone: user?.phone ?? "",
    province: "Punjab",
  });

  const [shipping, setShipping] = useState("standard");
  const [payment] = useState("cod");
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    province: "Punjab",
  });

  useEffect(() => {
    if (!user) return;
    setContact((c) => c || user.email || user.phone || "");
    setDelivery((d) => ({
      ...d,
      firstName: d.firstName || user.name?.split(" ")[0] || "",
      lastName: d.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      phone: d.phone || user.phone || "",
    }));
  }, [user]);

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (s, i) => s + i.price * i.quantity + (i.installationRequested ? (i.installationPrice || 0) : 0),
    0
  );

  const selectedShipping = shippingMethods.find((m) => m.id === shipping)!;
  const shippingCost = getShippingCost(subtotal, shipping);
  const total = Math.max(0, subtotal + shippingCost - couponDiscount);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const isDeliveryValid =
    delivery.firstName.trim() &&
    delivery.lastName.trim() &&
    delivery.address.trim() &&
    delivery.city.trim() &&
    delivery.phone.trim() &&
    contact.trim();

  const isBillingValid =
    billingSame ||
    (billing.firstName.trim() &&
      billing.lastName.trim() &&
      billing.address.trim() &&
      billing.city.trim() &&
      billing.phone.trim());

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    setCouponLoading(true);
    const ok = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (ok) toast.success("Coupon applied!");
    else toast.error("Invalid or expired coupon");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      router.push("/auth/login");
      return;
    }
    if (!isDeliveryValid) {
      toast.error("Please fill in all required delivery fields");
      return;
    }
    if (!isBillingValid) {
      toast.error("Please complete your billing address");
      return;
    }
    setLoading(true);
    try {
      const res = await api.createOrder({
        items,
        customerEmail: contact.includes("@") ? contact : user.email,
        shippingAddress: {
          fullName: `${delivery.firstName} ${delivery.lastName}`,
          phone: delivery.phone,
          address: delivery.address,
          city: delivery.city,
          state: delivery.province,
          postalCode: delivery.postalCode,
          country: delivery.country,
        },
        paymentMethod: "cod",
        couponCode: couponCode || undefined,
        shippingCost,
      });
      if (res.success && res.data) {
        clearCart();
        router.push(`/order-success?order=${res.data.orderNumber}&id=${res.data.id}`);
      } else {
        toast.error(res.error || "Order failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] dark:bg-background flex flex-col items-center justify-center px-4 py-20">
        <Package className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button asChild><Link href="/products">Continue Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] dark:bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0 min-w-0 max-w-[55vw] sm:max-w-none">
            <BrandLogo size="md" />
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 shrink-0">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete the steps below to place your order · {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8 items-start">

          {/* ── LEFT: Form steps ── */}
          <div className="order-2 lg:order-1 space-y-5">

            {/* STEP 1 — Contact */}
            <CheckoutSection
              step={1}
              title="Contact information"
              subtitle="We'll use this to send order updates"
              icon={User}
            >
              <div className="flex items-center justify-between mb-3">
                {!user && (
                  <Link href="/auth/login" className="text-sm text-primary font-medium hover:underline">
                    Sign in for faster checkout
                  </Link>
                )}
                {user && (
                  <span className="text-xs text-gray-400">Signed in as {user.email}</span>
                )}
              </div>
              <label className={labelClass}>Email or mobile number *</label>
              <input
                type="text"
                placeholder="you@email.com or 0300 1234567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={inputClass}
              />
              <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailOffers}
                  onChange={(e) => setEmailOffers(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Email me with news and offers</span>
              </label>
            </CheckoutSection>

            {/* STEP 2 — Delivery address */}
            <CheckoutSection
              step={2}
              title="Delivery address"
              subtitle="Where should we deliver your order?"
              icon={MapPin}
            >
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Country / Region</label>
                  <div className="relative">
                    <select
                      value={delivery.country}
                      onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>First name *</label>
                    <input type="text" value={delivery.firstName} onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })} className={inputClass} placeholder="Ahmed" />
                  </div>
                  <div>
                    <label className={labelClass}>Last name *</label>
                    <input type="text" value={delivery.lastName} onChange={(e) => setDelivery({ ...delivery, lastName: e.target.value })} className={inputClass} placeholder="Khan" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Street address *</label>
                  <input type="text" value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} className={inputClass} placeholder="House 23, Street 5, Gulberg III" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} className={inputClass} placeholder="Lahore" />
                  </div>
                  <div>
                    <label className={labelClass}>Postal code <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="text" value={delivery.postalCode} onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })} className={inputClass} placeholder="54000" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Province</label>
                  <div className="relative">
                    <select value={delivery.province} onChange={(e) => setDelivery({ ...delivery, province: e.target.value })} className={`${inputClass} appearance-none pr-10`}>
                      {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-border bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 font-medium shrink-0">+92</span>
                    <input type="tel" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} className={`${inputClass} rounded-l-none`} placeholder="300 1234567" />
                  </div>
                </div>
              </div>
            </CheckoutSection>

            {/* STEP 3 — Delivery method & charges */}
            <CheckoutSection
              step={3}
              title="Delivery method"
              subtitle="Select speed — charges shown below"
              icon={Truck}
            >
              <div className="space-y-2">
                {shippingMethods.map((method) => {
                  const methodCost = getShippingCost(subtotal, method.id);
                  const isSelected = shipping === method.id;
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card/50 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" value={method.id} checked={isSelected} onChange={() => setShipping(method.id)} className="h-4 w-4 text-primary focus:ring-primary" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{method.label}</p>
                          <p className="text-xs text-gray-400">{method.desc}</p>
                          {method.id === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD && (
                            <p className="text-[11px] text-green-600 mt-0.5 font-medium">Free on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground shrink-0 ml-3">
                        {methodCost === 0 ? <span className="text-green-600">FREE</span> : formatPrice(methodCost)}
                      </span>
                    </label>
                  );
                })}
              </div>

              {amountToFreeShipping > 0 && shipping === "standard" && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2.5">
                  <Truck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Add <strong>{formatPrice(amountToFreeShipping)}</strong> more for <strong>free standard delivery</strong>
                  </p>
                </div>
              )}

              <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-border px-4 py-3 flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Selected delivery charge</span>
                <span className="font-bold text-foreground">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Free · {selectedShipping.label}</span>
                  ) : (
                    <>{formatPrice(shippingCost)} · {selectedShipping.label}</>
                  )}
                </span>
              </div>
            </CheckoutSection>

            {/* STEP 4 — Payment */}
            <CheckoutSection
              step={4}
              title="Payment"
              subtitle="All transactions are secure and encrypted"
              icon={CreditCard}
            >
              <div className="rounded-xl border-2 border-primary overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3.5 bg-primary/5 border-b border-primary/20">
                  <input type="radio" name="payment" checked={payment === "cod"} readOnly className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground flex-1">Cash on Delivery (COD)</span>
                  <span className="text-lg">💵</span>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm text-gray-500">
                    Pay with cash when your order arrives. No advance payment required.
                  </p>
                </div>
              </div>
            </CheckoutSection>

            {/* Billing */}
            <CheckoutSection
              step={5}
              title="Billing address"
              subtitle="Invoice address for your order"
              icon={MapPin}
            >
              <div className="space-y-3">
                <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all", billingSame ? "border-primary bg-primary/5" : "border-border")}>
                  <input type="radio" name="billing" checked={billingSame} onChange={() => setBillingSame(true)} className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Same as delivery address</span>
                </label>
                <label className={cn("flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all", !billingSame ? "border-primary bg-primary/5" : "border-border")}>
                  <input type="radio" name="billing" checked={!billingSame} onChange={() => setBillingSame(false)} className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Use a different billing address</span>
                </label>

                {!billingSame && (
                  <div className="space-y-3 pt-2 border-t border-border mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>First name *</label><input type="text" value={billing.firstName} onChange={(e) => setBilling({ ...billing, firstName: e.target.value })} className={inputClass} /></div>
                      <div><label className={labelClass}>Last name *</label><input type="text" value={billing.lastName} onChange={(e) => setBilling({ ...billing, lastName: e.target.value })} className={inputClass} /></div>
                    </div>
                    <div><label className={labelClass}>Address *</label><input type="text" value={billing.address} onChange={(e) => setBilling({ ...billing, address: e.target.value })} className={inputClass} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>City *</label><input type="text" value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} className={inputClass} /></div>
                      <div><label className={labelClass}>Phone *</label><input type="tel" value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value })} className={inputClass} /></div>
                    </div>
                  </div>
                )}
              </div>
            </CheckoutSection>

            <div className="lg:hidden">
              <Button fullWidth size="lg" onClick={handlePlaceOrder} loading={loading} disabled={!isDeliveryValid} className="h-14 text-base font-bold">
                Place order · {formatPrice(total)}
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-gray-400 pb-4">
              <Link href="/terms" className="hover:text-primary">Terms & Conditions</Link>
              <Link href="/contact" className="hover:text-primary">Contact</Link>
              <Link href="/cart" className="hover:text-primary">← Back to cart</Link>
            </div>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-20 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-gray-50/80 dark:bg-gray-900/40">
                <h2 className="font-bold text-foreground">Order summary</h2>
                <p className="text-xs text-gray-500 mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-border shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300 text-[10px]">No img</div>
                        )}
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{item.name}</p>
                        {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                        {item.installationRequested && (
                          <p className="text-[10px] text-primary">+ Installation</p>
                        )}
                      </div>
                      <span className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-border" />

                {/* Coupon */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Discount code</p>
                  {couponCode ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Tag className="h-4 w-4 text-green-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-green-700 dark:text-green-400 truncate">{couponCode}</p>
                          <p className="text-xs text-green-600">− {formatPrice(couponDiscount)} off</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => { removeCoupon(); setCouponInput(""); }} className="p-1 text-gray-400 hover:text-red-500" aria-label="Remove coupon">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Enter coupon code"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                      <Button size="sm" variant="outline" onClick={handleApplyCoupon} loading={couponLoading}>Apply</Button>
                    </div>
                  )}
                  {!couponCode && (
                    <p className="text-[11px] text-gray-400 mt-1.5">Try: WELCOME500 · SAVE10 · FIRST20</p>
                  )}
                </div>

                <hr className="border-border" />

                {/* Price breakdown */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delivery · {selectedShipping.label}</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-semibold" : "font-medium text-foreground"}>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Coupon ({couponCode})</span>
                      <span>− {formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-border mt-1">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">PKR incl. delivery</span>
                      <span className="text-2xl font-black text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Button fullWidth size="lg" onClick={handlePlaceOrder} loading={loading} disabled={!isDeliveryValid} className="hidden lg:flex h-14 text-base font-bold">
                  Place order
                </Button>

                <div className="hidden lg:flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  Secure checkout · COD available nationwide
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
