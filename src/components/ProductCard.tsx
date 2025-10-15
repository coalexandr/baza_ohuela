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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <AspectRatio ratio={4 / 3}>
          <Image
            src={product.image}
            alt={product.name}
            className="rounded-md object-cover"
            fill
            unoptimized
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
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
        <p className="font-semibold">{product.price.toLocaleString()} лей</p>
        <Button asChild>
          <Link href={`/products/${product.id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
