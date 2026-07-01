"use client";

import { ProductRevealCard } from "@/components/ui/product-reveal-card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <ProductRevealCard
      id={product.id}
      name={product.nombre}
      price={formatPrice(Number(product.precio))}
      image={product.imageUrl || undefined}
      description={product.descripcion}
      categoryName={product.category?.name}
      enableAnimations={true}
    />
  );
}
