"use client";

import { useState, use } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import products from "@/data/products.json";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
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

            {/* Rating - Placeholder for future implementation */}
            {/* Reviews feature can be added later when backend supports it */}

            <p className="text-3xl font-bold text-blue-600 mb-6">
              {product.price.toLocaleString()} лей
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-8">
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Добавить в корзину - {(product.price * quantity).toLocaleString()} лей
          </Button>

          {/* Additional Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Почему выбрать этот товар?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Высококачественные материалы и мастерство</li>
              <li>• Надежный бренд с отличными отзывами</li>
              <li>• Быстрая и безопасная доставка</li>
              <li>• Политика возврата в течение 30 дней</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;