"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type CatWithImage = { name: string; image: string };

const FeaturedCategories = () => {
  const [featured, setFeatured] = useState<CatWithImage[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        const names: string[] = data.items || [];
        const images: Record<string, string> = data.images || {};
        const out: CatWithImage[] = names
          .map((n) => ({ name: n, image: images[n] }))
          .filter((c) => !!c.image)
          .slice(0, 4);
        if (active) setFeatured(out);
      } catch {}
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Популярные категории
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
