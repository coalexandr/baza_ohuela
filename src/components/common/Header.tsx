"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CatalogDropdown } from "@/components/CatalogDropdown";

const Header = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="relative h-16 w-48">
              <Image src="/image.png" alt="Logo" fill className="object-contain" sizes="(max-width:768px) 40vw, 200px" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
              Главная
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
              Каталог
            </Link>
            <CatalogDropdown />
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
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
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
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
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Главная
                </Link>
                <Link href="/products" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Каталог
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
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
