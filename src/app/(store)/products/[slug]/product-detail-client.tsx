"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Package, Shield, Truck, Star, CheckCircle, ChevronRight, Share2, Minus, Plus, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, calculateDiscount, formatDate } from "@/lib/utils";
import type { Product, Review } from "@/types";
import toast from "react-hot-toast";

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
  related: Product[];
}

export default function ProductDetailClient({ product, reviews, related }: ProductDetailClientProps) {
  const router = useRouter();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]?.value || "");
  const [withInstallation, setWithInstallation] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0;
  const totalPrice = product.price * quantity + (withInstallation && product.installationPrice ? product.installationPrice : 0);

  const primaryImage = imgError
    ? `https://placehold.co/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(product.name.slice(0, 12))}`
    : product.images[activeImage]?.url || "";

  const cartPayload = {
    productId: product.id, name: product.name,
    image: product.images[0]?.url || "", slug: product.slug,
    price: product.price, originalPrice: product.originalPrice,
    quantity: 1, variant: selectedVariant,
    installationRequested: withInstallation,
    installationPrice: withInstallation ? product.installationPrice : undefined,
    maxStock: product.stock,
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(cartPayload);
    toast.success(`Added ${quantity}x to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) addItem(cartPayload);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: product.category, href: `/products?category=${product.categorySlug}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12">
          {/* ΓöÇΓöÇ Image Gallery ΓöÇΓöÇ */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.images[activeImage]?.alt || product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={() => setImgError(true)}
              />
              {discount > 0 && (
                <Badge variant="danger" className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
                  {discount}% OFF
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="success" className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs">New</Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => { setActiveImage(i); setImgError(false); }}
                    className={`relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary" : "border-border hover:border-gray-300"}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ΓöÇΓöÇ Product Info ΓöÇΓöÇ */}
          <div className="space-y-4 sm:space-y-5">
            {/* Breadcrumb links */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <Link href={`/products?brand=${product.brandSlug}`} className="text-sm text-primary font-semibold hover:underline">{product.brand}</Link>
                <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
                <Link href={`/products?category=${product.categorySlug}`} className="text-sm text-gray-500 hover:text-primary transition-colors">{product.category}</Link>
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary dark:text-white leading-tight mb-2">{product.name}</h1>
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" className="mb-2" />
              <p className="text-sm text-gray-500 leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 sm:gap-3 flex-wrap">
              <div className="text-2xl sm:text-3xl font-black text-primary">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="text-sm sm:text-base text-gray-400 line-through pb-0.5">{formatPrice(product.originalPrice)}</div>
              )}
              {discount > 0 && (
                <Badge variant="danger" className="pb-0.5 text-xs">Save {formatPrice(product.originalPrice! - product.price)}</Badge>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.inStock ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm font-medium text-green-600">In Stock</span>
                  <span className="text-xs text-gray-400">({product.stock} available)</span>
                </>
              ) : (
                <span className="text-sm font-medium text-red-500">Out of Stock</span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.value)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm border-2 font-medium transition-all ${selectedVariant === v.value ? "border-primary bg-primary/10 text-primary" : "border-border text-gray-600 hover:border-gray-300"}`}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Installation */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="h-10 sm:h-11 px-4 sm:px-5 flex items-center text-base font-bold border-x border-border">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">├ù {formatPrice(product.price)} each</span>
              </div>

              {product.installationAvailable && (
                <label className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={withInstallation} onChange={e => setWithInstallation(e.target.checked)} className="mt-0.5 h-4 w-4 rounded text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-400">Add Professional Installation</p>
                    <p className="text-xs text-green-600 dark:text-green-500">Certified technician ┬╖ +{formatPrice(product.installationPrice || 0)} ┬╖ At your nearest branch</p>
                  </div>
                </label>
              )}
            </div>

            {/* Total & CTA */}
            <div className="flex items-center gap-2 pt-1">
              <div className="text-sm text-gray-500">Total:</div>
              <div className="text-lg sm:text-xl font-black text-primary">{formatPrice(totalPrice)}</div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="lg"
                variant="outline"
                leftIcon={<ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />}
                className="flex-1 min-w-0 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Add to Cart
              </Button>

              {/* Buy Now */}
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                size="lg"
                leftIcon={<Zap className="h-4 w-4 sm:h-5 sm:w-5" />}
                className="flex-1 min-w-0"
              >
                Buy Now
              </Button>

              {/* Wishlist */}
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 sm:h-11 sm:w-11 shrink-0"
                onClick={() => { toggleItem({ productId: product.id, name: product.name, image: product.images[0]?.url || "", slug: product.slug, price: product.price, addedAt: new Date().toISOString() }); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!"); }}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
              </Button>

              {/* Share */}
              <Button variant="ghost" size="icon" className="h-10 w-10 sm:h-11 sm:w-11 shrink-0">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-border">
              {[
                { icon: Truck, label: "Free Delivery", sub: "Rs.1500+" },
                { icon: Shield, label: product.warranty ? "Warranty" : "Genuine", sub: product.warranty || "Authentic" },
                { icon: Package, label: "Easy Returns", sub: "7 Days" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center p-1">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <p className="text-[10px] sm:text-xs font-semibold text-secondary dark:text-white leading-tight">{label}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Tabs ΓöÇΓöÇ */}
        <Tabs defaultValue="description" className="mb-12">
          {/* Scrollable tab list on mobile */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6">
            <TabsList className="w-max min-w-full sm:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="compatibility">Vehicle Fit</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description">
            <div className="bg-white dark:bg-card rounded-2xl border border-border p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specs">
            <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden">
              {product.specifications.map((spec, i) => (
                <div key={i} className={`flex items-start sm:items-center px-4 sm:px-5 py-3 gap-3 sm:gap-4 text-sm ${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}>
                  <span className="text-gray-500 w-28 sm:w-40 shrink-0 text-xs sm:text-sm">{spec.label}</span>
                  <span className="font-medium text-secondary dark:text-white text-xs sm:text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compatibility">
            {product.vehicleCompatibility ? (
              <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-4 sm:px-5 py-3 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span>Make</span><span>Model</span><span>Years</span>
                </div>
                {product.vehicleCompatibility.map((v, i) => (
                  <div key={i} className="px-4 sm:px-5 py-3 grid grid-cols-3 text-xs sm:text-sm border-t border-border">
                    <span className="font-medium text-secondary dark:text-white">{v.brand}</span>
                    <span className="text-gray-600 dark:text-gray-300">{v.model}</span>
                    <span className="text-gray-500 tabular-nums">{v.yearFrom}ΓÇô{v.yearTo}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-card rounded-2xl border border-border p-8 text-center text-gray-400 text-sm">
                Universal fitment ΓÇö compatible with all vehicles
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white dark:bg-card rounded-2xl border border-border p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {review.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-secondary dark:text-white truncate">{review.userName}</p>
                          {review.isVerifiedPurchase && <Badge variant="success" className="text-[10px] py-0">Verified</Badge>}
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-secondary dark:text-white mb-1">{review.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-card rounded-2xl border border-border p-8 text-center text-gray-400 text-sm">
                No reviews yet. Be the first to review!
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-secondary dark:text-white mb-4 sm:mb-5">Related Products</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
              {related.map(p => (
                <div key={p.id} className="h-full">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
