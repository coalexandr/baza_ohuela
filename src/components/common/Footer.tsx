"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-40">
              <Image
                src="/image.png"
                alt="Gemini Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Откройте для себя мир качественных товаров, подобранных специально для вас. Простой, быстрый и надежный опыт покупок.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Быстрые ссылки</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Главная
              </Link>
              <Link href="/products" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Все товары
              </Link>
              <Link href="/categories" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Категории
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Связаться с нами
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Служба поддержки</h4>
            <div className="space-y-2">
              <Link href="/shipping" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Информация о доставке
              </Link>
              <Link href="/returns" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Возвраты и обмены
              </Link>
              <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Часто задаваемые вопросы
              </Link>
              <Link href="/support" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Поддержка
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Связаться с нами</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+37378337228</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">coalexandr.work@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  Gheorghe Madan 87/5 ap. 70
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Gemini. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Условия обслуживания
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
