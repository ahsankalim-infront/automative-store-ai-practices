"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/product/product-card";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import type { Product } from "@/types";

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  viewAllHref?: string;
  cols?: 2 | 3 | 4 | 5;
}

export function ProductsSection({
  title, subtitle, badge, products, viewAllHref, cols = 4
}: ProductsSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  }[cols];

  return (
    <>
      <div>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          badge={badge}
          viewAllHref={viewAllHref}
        />
        {/* items-stretch (CSS grid default) + h-full on motion.div ensures equal-height cards */}
        <div className={`grid ${gridCols} gap-4 items-stretch`}>
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </motion.div>
          ))}
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
