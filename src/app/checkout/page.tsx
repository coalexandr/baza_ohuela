"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, MapPin, Phone, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order object (in real app, this would be sent to backend)
    const order = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      total: getCartTotal(),
      customerInfo: formData,
      status: 'pending' as const,
      createdAt: new Date()
    };

    console.log('Order placed:', order);

    clearCart();
    router.push("/success");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Нет товаров в корзине</h1>
        <p className="text-gray-600">Пожалуйста, добавьте товары в корзину перед оформлением заказа.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Оформление заказа
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Information Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="mr-3 h-6 w-6 text-blue-600" />
              Информация о доставке
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Полное имя *
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше полное имя"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Номер телефона *
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Введите ваш номер телефона"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Адрес доставки *
                </label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Введите ваш полный адрес"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Примечания к доставке (необязательно)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Любые специальные инструкции по доставке..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Обработка заказа...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Оформить заказ (оплата при получении)
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900">Оплата при получении</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Оплачивайте когда заказ прибудет к вашему порогу. Предварительная оплата не требуется.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Сумма заказа
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Кол-во: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} лей
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
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

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Итого</span>
                <span>{getCartTotal().toLocaleString()} лей</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Бесплатная доставка</p>
                  <p className="text-xs text-green-700">Ориентировочная доставка: 3-5 рабочих дней</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
