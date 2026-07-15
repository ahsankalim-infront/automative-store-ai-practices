"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({ productId: item.productId, name: item.name, image: item.image, slug: item.slug, price: item.price, quantity: 1, maxStock: 99 });
    removeItem(item.productId);
    toast.success("Moved to cart!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
        </div>
        {items.length > 0 && (
          <Button asChild variant="outline" size="sm">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-10 w-10" />}
          title="Your wishlist is empty"
          description="Save products you love and come back to buy them later."
          action={{ label: "Browse Products", href: "/products" }}
        />
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.productId} className="h-full bg-card rounded-2xl border border-border p-4 flex flex-col">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 overflow-hidden shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300"><ShoppingBag className="h-8 w-8" /></div>
                )}
                <button
                  type="button"
                  onClick={() => { removeItem(item.productId); toast.success("Removed from wishlist"); }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2 block flex-1">
                {item.name}
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-black text-primary">{formatPrice(item.price)}</span>
                {item.originalPrice && <span className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>}
              </div>
              <Button fullWidth size="sm" onClick={() => handleMoveToCart(item)} leftIcon={<ShoppingCart className="h-3.5 w-3.5" />}>
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
