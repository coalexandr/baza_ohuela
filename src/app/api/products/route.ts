import { NextRequest, NextResponse } from 'next/server'
import { queryProducts } from '@/lib/products'
import crypto from 'crypto'
import { gzipSync } from 'zlib'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || undefined
  const category = searchParams.get('category') || undefined
  const sort = (searchParams.get('sort') as 'name' | 'price-low' | 'price-high') || undefined
  const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined
  const discounted = searchParams.get('discounted') === 'true'
  const brand = searchParams.get('brand') || undefined

  const { total, items } = await queryProducts({ q, category, sort, offset, limit, discounted, brand })
  const itemsLite = items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    priceOld: p.priceOld,
    image: p.image,
    category: p.category,
  }))
  const body = { total, items: itemsLite }
  const payload = JSON.stringify(body)
  const etag = 'W/"' + crypto.createHash('sha1').update(payload).digest('hex') + '"'
  const ifNoneMatch = req.headers.get('if-none-match')
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, { status: 304, headers: { 'ETag': etag } })
  }
  const accept = req.headers.get('accept-encoding') || ''
  if (accept.includes('gzip')) {
    const gz = gzipSync(Buffer.from(payload))
    return new NextResponse(gz, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
        'ETag': etag,
        'Content-Encoding': 'gzip',
      },
    })
  }
  return new NextResponse(payload, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
      'ETag': etag,
    },
  })
}
