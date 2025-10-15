"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Лучшие товары{" "}
          <span className="text-blue-600">по лучшим ценам</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Откройте для себя мир качественных товаров, подобранных специально для вас. Простой, быстрый и надежный опыт покупок.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-10 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Купить сейчас
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
