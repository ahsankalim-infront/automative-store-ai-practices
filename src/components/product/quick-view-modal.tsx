"use client";
import { useState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Heart, Package, ExternalLink, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.value || "");
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const cartPayload = {
    productId: product.id, name: product.name,
    image: product.images[0]?.url || "", slug: product.slug,
    price: product.price, originalPrice: product.originalPrice,
    quantity: 1, variant: selectedVariant, maxStock: product.stock,
  };

  const handleAddToCart = () => {
    if (!product.inStock || product.stock <= 0) {
      toast.error("This product is sold out");
      return;
    }
    for (let i = 0; i < qty; i++) addItem(cartPayload);
    toast.success(`${qty}x added to cart!`);
    onClose();
  };

  const handleBuyNow = () => {
    if (!product.inStock || product.stock <= 0) {
      toast.error("This product is sold out");
      return;
    }
    for (let i = 0; i < qty; i++) addItem(cartPayload);
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className={[
            "relative z-10 flex flex-col w-full bg-card shadow-2xl",
            "max-h-[92dvh] overflow-hidden",
            "rounded-t-2xl sm:rounded-2xl sm:max-w-2xl",
            "pb-[env(safe-area-inset-bottom)]",
          ].join(" ")}
        >
          {/* Mobile handle */}
          <div className="sm:hidden shrink-0 flex justify-center pt-3 pb-1">
            <span className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="overflow-y-auto overscroll-contain min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative h-52 xs:h-64 sm:min-h-[320px] bg-gray-100 dark:bg-gray-800 sm:rounded-l-2xl overflow-hidden shrink-0">
                <Image
                  src={imgError ? `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.slice(0, 10))}` : (product.images[0]?.url || "")}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  onError={() => setImgError(true)}
                />
                {product.discount && (
                  <Badge variant="danger" className="absolute top-3 left-3">{product.discount}% OFF</Badge>
                )}
              </div>

              <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{product.brand} · {product.category}</p>
                  <h2 className="font-bold text-foreground text-base sm:text-lg leading-snug pr-8">{product.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                </div>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-black text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-3">{product.shortDescription}</p>

                {product.variants && product.variants.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Color / Variant</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${selectedVariant === v.value ? "border-primary bg-primary/10 text-primary" : "border-border text-gray-600 hover:border-gray-300"}`}
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 flex items-center justify-center hover:bg-surface transition-colors text-lg font-bold">−</button>
                    <span className="h-9 px-3 flex items-center text-sm font-semibold border-x border-border min-w-[2.5rem] justify-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="h-9 w-9 flex items-center justify-center hover:bg-surface transition-colors text-lg font-bold">+</button>
                  </div>
                  {product.inStock ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">Sold Out</span>
                  )}
                </div>

                {product.installationAvailable && (
                  <div className="flex items-start gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    <Package className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Professional installation available (+{formatPrice(product.installationPrice || 0)})</span>
                  </div>
                )}

                <div className="flex flex-col xs:flex-row gap-2 pt-1">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    variant="outline"
                    leftIcon={<ShoppingCart className="h-4 w-4" />}
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white w-full"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    leftIcon={<Zap className="h-4 w-4" />}
                    className="flex-1 w-full"
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full xs:w-10 shrink-0"
                    onClick={() => {
                      toggleItem({
                        productId: product.id,
                        name: product.name,
                        image: product.images[0]?.url || "",
                        slug: product.slug,
                        price: product.price,
                        addedAt: new Date().toISOString(),
                      });
                    }}
                  >
                    <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary text-primary" : ""}`} />
                  </Button>
                </div>

                <Link
                  href={`/products/${product.slug}`}
                  className="flex items-center gap-1 text-xs text-primary hover:gap-2 transition-all font-medium justify-center py-2"
                >
                  View Full Details <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
