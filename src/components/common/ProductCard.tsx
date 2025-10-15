"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group">
      <div className="relative h-80 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => addToCart(product)}
            className="bg-white text-gray-800 py-2 px-4 rounded-full font-semibold flex items-center space-x-2"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <div className="mt-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-gray-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;