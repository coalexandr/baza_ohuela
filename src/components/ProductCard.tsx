"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Product } from "../types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <AspectRatio ratio={4 / 3}>
          <Image
            src={product.image}
            alt={product.name}
            className="rounded-md object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />
          {product.price !== null && product.priceOld && product.priceOld > product.price && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.priceOld) * 100)}%
            </div>
          )}
        </AspectRatio>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="mt-1">{product.category}</CardDescription>
        {product.reviews && (
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < (product.reviews?.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviews?.count || 0})
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {product.price !== null ? (
          <div className="flex items-baseline gap-2">
            {product.priceOld ? (
              <span className="text-sm text-gray-400 line-through">
                {product.priceOld.toLocaleString()} MDL
              </span>
            ) : null}
            <p className="font-semibold text-blue-600">
              {product.price.toLocaleString()} MDL
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Цена по запросу</p>
        )}
        <Button asChild>
          <Link href={`/products/${product.id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
