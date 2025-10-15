"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { cartItems, removeFromCart, getCartTotal, addToCart } = useCart();
  // Initialize quantities from cart items
  // const initialQuantities: { [key: number]: number } = {};
  // cartItems.forEach(item => {
  //   initialQuantities[item.id] = item.quantity;
  // });

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Update cart by removing all instances and adding back the correct amount
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      // Remove all instances first
      for (let i = 0; i < item.quantity; i++) {
        removeFromCart(productId);
      }
      // Add back the correct amount
      for (let i = 0; i < newQuantity; i++) {
        addToCart(item);
      }
    }
  };

  const getItemSubtotal = (item: { price: number; quantity: number }) => {
    return item.price * item.quantity;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Ваша корзина
      </motion.h1>

      {cartItems.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ваша корзина пуста</h2>
          <p className="text-lg text-gray-600 mb-8">Добавьте товары для начала покупок!</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/products">Продолжить покупки</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {cartItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-6">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                    <p className="text-blue-600 font-semibold">
                      {item.price.toLocaleString()} лей за шт.
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {getItemSubtotal(item).toLocaleString()} лей
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Сумма заказа
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Промежуточный итог ({cartItems.length} товаров)</span>
                  <span>{getCartTotal().toLocaleString()} лей</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Доставка</span>
                  <span className="text-green-600">Бесплатно</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Налог</span>
                  <span>0 лей</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Итого</span>
                  <span>{getCartTotal().toLocaleString()} лей</span>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-300"
              >
                <Link href="/checkout">
                  Оформить заказ
                </Link>
              </Button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Оплата при получении - оплата не требуется сейчас
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
