"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { api } from "@/lib/api/client";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id"> & { id?: string }) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  toggleInstallation: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscount: number;
  itemCount: number;
  subtotal: number;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce(
          (sum, item) =>
            sum +
            item.price * item.quantity +
            (item.installationRequested ? (item.installationPrice || 0) : 0),
          0
        );
      },

      get total() {
        return get().subtotal - get().couponDiscount;
      },

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variant === item.variant
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variant === item.variant
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, id: `${item.productId}-${item.variant || "default"}-${Date.now()}` },
            ],
          };
        }),

      removeItem: (productId, variant) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variant === variant)
          ),
        })),

      updateQuantity: (productId, quantity, variant) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !(i.productId === productId && i.variant === variant))
              : state.items.map((i) =>
                  i.productId === productId && i.variant === variant
                    ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                    : i
                ),
        })),

      toggleInstallation: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, installationRequested: !i.installationRequested }
              : i
          ),
        })),

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: async (code) => {
        const subtotal = get().items.reduce(
          (sum, item) =>
            sum + item.price * item.quantity + (item.installationRequested ? (item.installationPrice || 0) : 0),
          0
        );
        const res = await api.validateCoupon(code, subtotal);
        if (res.success && res.data?.valid && res.data.discount) {
          set({ couponCode: code.toUpperCase(), couponDiscount: res.data.discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
    }),
    { name: "autozone-cart" }
  )
);
