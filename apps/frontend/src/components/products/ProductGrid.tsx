"use client";

import type { Glasses } from "@glasses-tryon/shared";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Glasses[];
  selectedProduct?: Glasses;
  onSelect: (product: Glasses) => void;
};

export function ProductGrid({
  products,
  selectedProduct,
  onSelect,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[#d4c6aa] bg-[#fbf8f2] p-8 text-center text-sm text-[#5f574d]">
        No active glasses are available for this shop yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={selectedProduct?.id === product.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
