import { listCategories, listCategoriesTree, loadAllProducts } from '@/lib/products'
import crypto from 'crypto'

export async function GET() {
  const [list, tree, products] = await Promise.all([
    listCategories(),
    listCategoriesTree(),
    loadAllProducts(),
  ])
  const items = list.map(c => c.name)
  const counts: Record<string, number> = {}
  const images: Record<string, string> = {}
  for (const c of list) counts[c.name] = c.count
  for (const cat of items) {
    const p = products.find(p => p.category === cat && p.image)
    if (p) images[cat] = p.image
  }
  const payload = JSON.stringify({ items, counts, tree, images })
  const etag = 'W/"' + crypto.createHash('sha1').update(payload).digest('hex') + '"'
  // no req in signature; Next.js doesn't pass request here. ETag provided for caches
  return new Response(payload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
      'ETag': etag,
    },
  })
}
