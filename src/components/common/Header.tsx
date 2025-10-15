"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import categories from "@/data/categories.json";
import { Category } from "@/types";

const Header = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="relative h-16 w-48">
              <Image
                src="/image.png"
                alt="Gemini Logo"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Главная
            </Link>
            <Link
              href="/products"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Все товары
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center">
                Категории
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category: Category) => (
                      <div key={category.id} className="group/sub">
                        <Link
                          href={`/products?category=${category.name}`}
                          className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200"
                        >
                          {category.name}
                        </Link>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="ml-3 mt-1 space-y-1">
                            {category.subcategories.slice(0, 3).map((subcategory: Category) => (
                              <Link
                                key={subcategory.id}
                                href={`/products?category=${subcategory.name}`}
                                className="block px-3 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded transition-all duration-200"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 3 && (
                              <Link
                                href={`/products?category=${category.name}`}
                                className="block px-3 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                +{category.subcategories.length - 3} more
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link
                      href="/products"
                      className="block text-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Посмотреть все товары
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Контакты
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Главная
                </Link>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Все товары
                </Link>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Контакты
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;