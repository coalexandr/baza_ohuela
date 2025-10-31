"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import type { Product } from "@/types";

const ProductGrid = () => {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/products?limit=24', { signal: controller.signal })
      .then(r => r.json())
      .then(d => setItems(d.items || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
