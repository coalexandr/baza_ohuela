"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Truck, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <CheckCircle className="mx-auto h-24 w-24 text-green-500 mb-6" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Заказ успешно оформлен!
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Спасибо за покупку. Ваш заказ подтвержден и будет доставлен в ближайшее время.
        </motion.p>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-4 mb-3">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Заказ подтвержден</h3>
              <p className="text-sm text-gray-600">Ваш заказ получен</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-orange-100 rounded-full p-4 mb-3">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Being Prepared</h3>
              <p className="text-sm text-gray-600">We&apos;re packing your items</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-4 mb-3">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">В пути</h3>
              <p className="text-sm text-gray-600">Ориентировочная доставка: 3-5 дней</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Next?</h2>
          <div className="text-left space-y-3">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700">You&apos;ll receive an SMS confirmation with your order details</p>
            </div>
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700">Наш партнер по доставке свяжется с вами перед доставкой</p>
            </div>
            <div className="flex items-start">
              <Home className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-700">Оплатите наличными при получении заказа у вашего порога</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              На главную
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/products" className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Продолжить покупки
            </Link>
          </Button>
        </motion.div>

        <motion.p
          className="text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Нужна помощь? Свяжитесь с нашей службой поддержки support@gemini.com
        </motion.p>
      </div>
    </div>
  );
};

export default SuccessPage;
