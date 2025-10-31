"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.resolve(params).then(({ id }) => {
      fetch(`/api/products/${id}`)
        .then((r) => {
          if (!r.ok) throw new Error("not found");
          return r.json();
        })
        .then((p) => {
          if (mounted) setProduct(p);
        })
        .catch(() => mounted && setError("Товар не найден"));
    });
    return () => {
      mounted = false;
    };
  }, [params]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
        <p className="text-gray-600">Проверьте ссылку или вернитесь в каталог.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  const gallery = product.images && product.images.length ? product.images : [product.image];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      {product.breadcrumbs && product.breadcrumbs.length > 0 && (
        <nav className="mb-6 text-sm text-gray-500 flex items-center flex-wrap gap-2">
          <a href="/products" className="hover:text-gray-700">Каталог</a>
          {product.breadcrumbs.map((bc, idx) => (
            <span key={bc+idx} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              <a href={`/products?category=${encodeURIComponent(bc)}`} className="hover:text-gray-700">{bc}</a>
            </span>
          ))}
        </nav>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={gallery[activeImage]}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain bg-white"
              priority
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {gallery.map((src, idx) => (
                <button key={`${src}-${idx}` } onClick={() => setActiveImage(idx)} className={`relative aspect-square rounded-md overflow-hidden border ${idx === activeImage ? 'border-blue-500' : 'border-gray-200'}`}>
                  <Image src={src} alt={`${product.name} ${idx + 1}`} fill unoptimized sizes="(max-width: 1024px) 20vw, 10vw" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{product.category}</p>

            <div className="flex items-baseline gap-3 mb-6">
              {product.priceOld ? (
                <span className="text-gray-400 line-through">{product.priceOld.toLocaleString()} MDL</span>
              ) : null}
              {product.price !== null ? (
                <span className="text-3xl font-bold text-blue-600">{product.price.toLocaleString()} MDL</span>
              ) : (
                <span className="text-lg text-gray-500">Цена по запросу</span>
              )}
            </div>

            <div className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
              {product.description && product.description.length > 10
                ? product.description
                : (product.specs && product.specs.length
                    ? product.specs.slice(0,5).map(s => `${s.name}: ${s.value}`).join('\n')
                    : '')}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium text-gray-700">Количество:</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-300"
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Добавить в корзину
          </Button>

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Характеристики</h3>
              <ul className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specs.map((s, i) => (
                  <li key={`${s.name}-${s.value}-${i}` } className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">{s.name}</span>
                    <span className="font-medium text-gray-900">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

