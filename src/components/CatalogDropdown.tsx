"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
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
// switched to dynamic categories from API

export function CatalogDropdown() {
  const [isClient, setIsClient] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [cats, setCats] = React.useState<{name: string, count: number, image?: string}[]>([])

  React.useEffect(() => {
    setIsClient(true)
    const controller = new AbortController()
    fetch('/api/categories', { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        const items: string[] = d.items || []
        const counts: Record<string, number> = d.counts || {}
        const images: Record<string, string> = d.images || {}
        const out = items.map((name: string) => ({
          name,
          count: counts[name] ?? 0,
          image: images[name],
        }))
        // sort by count desc so крупные категории сверху
        out.sort((a,b)=> (b.count||0) - (a.count||0))
        setCats(out)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-block"
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Menu className="h-5 w-5" aria-hidden />
            <span>Категории</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[min(96vw,1000px)] max-h-[70vh] overflow-auto p-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cats.map((c) => (
              <Link
                key={c.name}
                href={`/products?category=${encodeURIComponent(c.name)}`}
                className="group relative block rounded-lg border overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-gray-50">
                  {c.image ? (
                    <Image src={c.image} alt={c.name} fill unoptimized sizes="(max-width: 1024px) 40vw, 200px" className="object-cover" />
                  ) : null}
                </div>
                <div className="p-2 text-sm font-medium text-gray-900 line-clamp-2">
                  {c.name}
                  {typeof c.count === 'number' && c.count > 0 ? <span className="text-gray-500 font-normal"> ({c.count})</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}
