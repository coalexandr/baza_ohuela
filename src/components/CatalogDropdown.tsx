"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import categories from "../data/categories.json"
import { Category } from "../types"

export function CatalogDropdown() {
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open catalog menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {categories.map((category: Category) => (
          category.subcategories && category.subcategories.length > 0 ? (
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="flex items-center justify-between">
                <span>{category.name}</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {category.subcategories.map((subcategory: Category) => (
                  <DropdownMenuItem key={subcategory.id} asChild>
                    <Link href={`/products?category=${subcategory.name}`}>
                      {subcategory.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={category.id} asChild>
              <Link href={`/products?category=${category.name}`}>
                {category.name}
              </Link>
            </DropdownMenuItem>
          )
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
