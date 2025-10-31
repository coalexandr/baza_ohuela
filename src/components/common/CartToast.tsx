"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types";

type ToastItem = {
  id: number;
  product: Product;
};

export default function CartToast() {
  const [queue, setQueue] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onAdd(e: Event) {
      const ce = e as CustomEvent<{ product: Product }>;
      const product = ce.detail?.product;
      if (!product) return;
      setQueue((prev) => {
        const exists = prev.find((i) => i.product.id === product.id);
        if (exists) return prev; // avoid duplicates stacking
        const item = { id: Date.now(), product };
        return [...prev, item];
      });
    }
    window.addEventListener("cart:add", onAdd as EventListener);
    return () => window.removeEventListener("cart:add", onAdd as EventListener);
  }, []);

  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, 3000);
    return () => clearTimeout(t);
  }, [queue]);

  return (
    <div className="fixed z-[60] bottom-4 right-4 flex flex-col gap-3 w-[92vw] max-w-sm">
      <AnimatePresence>
        {queue.map(({ id, product }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex items-center p-3">
              <div className="relative h-14 w-14 mr-3 rounded overflow-hidden bg-gray-50">
                <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Добавлено в корзину</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                <div className="mt-1 text-sm text-gray-700">
                  {product.price !== null ? (
                    <span className="font-semibold text-blue-600">{product.price.toLocaleString()} MDL</span>
                  ) : (
                    <span className="text-gray-500">Цена по запросу</span>
                  )}
                </div>
              </div>
            </div>
            <div className="px-3 pb-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setQueue((prev) => prev.slice(1))}
                className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50"
              >
                Продолжить
              </button>
              <Link
                href="/cart"
                className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                В корзину
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

