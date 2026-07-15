"use client";
import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye, Zap, Package, Zap as BuyIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  onQuickView?: (product: Product) => void;
}

// Fallback SVG rendered as a data URI — no network request, always same size
const FALLBACK_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F3F4F6'/%3E%3Cpath d='M160 110h80v80h-80z' fill='%23E5E7EB'/%3E%3Cpath d='M172 150h56M200 122v56' stroke='%23D1D5DB' stroke-width='8' stroke-linecap='round'/%3E%3C/svg%3E`;

function useClientMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ProductCard({ product, view = "grid", onQuickView }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const mounted = useClientMounted();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isWishlisted, toggleItem } = useWishlistStore();
  const wishlisted = mounted && isWishlisted(product.id);

  // Always resolve to a valid URL — fallback is an inline SVG so it NEVER triggers another network error
  const primaryImage = (!product.images[0]?.url || imgError) ? FALLBACK_SVG : product.images[0].url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || "",
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      maxStock: product.stock,
    });
    toast.success("Added to cart!", { id: `cart-${product.id}` });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || "",
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      maxStock: product.stock,
    });
    router.push("/checkout");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || "",
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      addedAt: new Date().toISOString(),
    });
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!", { id: `wish-${product.id}` });
  };

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : product.discount || 0;

  /* ── LIST VIEW ──────────────────────────────────────────────────────────── */
  if (view === "list") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="h-full bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      >
        <Link href={`/products/${product.slug}`} className="flex flex-col xs:flex-row h-full gap-0">
          {/* Fixed-size image — never changes height */}
          <div className="relative h-44 xs:h-auto xs:w-36 sm:w-40 shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <Image
              src={primaryImage}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 160px"
              onError={() => setImgError(true)}
            />
            {discount > 0 && (
              <Badge variant="danger" className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5">
                {discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Content — fills remaining space, pushes price+btn to bottom */}
          <div className="flex-1 min-w-0 flex flex-col p-3 sm:p-4 gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5 truncate">{product.brand} · {product.category}</p>
              <h3 className="font-semibold text-foreground line-clamp-2 text-xs sm:text-sm mb-1.5">
                {product.name}
              </h3>
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
            </div>

            <div className="mt-auto pt-2 border-t border-border space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-bold text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <div className="flex gap-1.5">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                  <span>Add to Cart</span>
                </button>
                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BuyIcon className="h-3.5 w-3.5 shrink-0" />
                  <span>Buy Now</span>
                </button>
                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg border border-border hover:border-primary hover:text-primary transition-all"
                >
                  <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  /* ── GRID VIEW ──────────────────────────────────────────────────────────── */
  return (
    // h-full: stretches to fill the grid cell so all cards in a row are equal height
    <motion.div
      whileHover={{ y: -3 }}
      className="group h-full flex flex-col bg-card rounded-2xl border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
    >
      {/* ── Image — fixed height, NEVER collapses or grows ── */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative shrink-0"
        style={{ height: "192px" }}   /* fixed 192px = sm:h-48, consistent on all screens */
      >
        {/* Solid background so the card area is always filled even before image loads */}
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800" />

        <Image
          src={primaryImage}
          alt={product.images[0]?.alt || product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <Badge variant="danger" className="text-[10px] px-1.5 py-0.5">{discount}% OFF</Badge>
          )}
          {product.isNew && (
            <Badge variant="success" className="text-[10px] px-1.5 py-0.5">New</Badge>
          )}
          {product.isFlashSale && (
            <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
              <Zap className="h-2.5 w-2.5" /> Flash
            </Badge>
          )}
        </div>

        {/* Wishlist + Quick View — always visible on touch, hover-only on desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWishlist}
            aria-label="Wishlist"
            className="h-7 w-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          >
            <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              aria-label="Quick view"
              className="h-7 w-7 rounded-full bg-white/90 dark:bg-gray-800/90 shadow flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-white text-secondary text-[10px] font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* ── Content — flex-1 fills remaining card height ── */}
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        {/* Top: brand + name + rating — grows to fill space */}
        <div className="flex-1">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1 truncate">{product.brand}</p>
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug mb-2">
              {product.name}
            </h3>
          </Link>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
          {product.installationAvailable && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-green-600 mt-1.5">
              <Package className="h-3 w-3 shrink-0" />
              <span>Installation Available</span>
            </div>
          )}
        </div>

        {/* Bottom: price + buttons — always pinned to card bottom */}
        <div className="mt-3 pt-2.5 border-t border-border space-y-2">
          {/* Price row */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-primary leading-tight">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            ) : (
              <span className="text-[10px] sm:text-xs opacity-0 select-none">—</span>
            )}
          </div>

          {/* Action buttons row */}
          <div className="flex gap-1.5">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-1 h-7 sm:h-8 rounded-lg border border-primary text-primary text-[10px] sm:text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span>Add</span>
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-1 h-7 sm:h-8 rounded-lg bg-primary text-white text-[10px] sm:text-xs font-bold hover:bg-primary-dark transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <BuyIcon className="h-3 w-3 shrink-0" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
