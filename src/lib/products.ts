import fs from 'fs/promises'
import path from 'path'

export type RawProduct = {
  name: string
  url?: string
  breadcrumbs?: string[]
  category_path?: string[]
  price_old?: number | string | null
  price_new?: number | string | null
  price?: number | string | null
  image_cover?: string
  description?: string
  images?: string[]
  specifications?: { name: string; value: string }[]
}

export type NormalizedProduct = {
  id: number
  name: string
  price: number | null
  priceOld?: number | null
  description: string
  image: string
  images?: string[]
  category: string
  breadcrumbs: string[]
  url?: string
  specs?: { name: string; value: string }[]
}

const DATA_PRODUCTS_PATH = path.resolve(process.cwd(), 'data', 'products.json')
const DATA_IMAGES_PREFIX = 'data/images/'

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null
  if (typeof v === 'number') return isFinite(v) ? v : null
  if (typeof v === 'string') {
    const matches = v.match(/\d[\d\s.,]*/g)
    if (!matches) return null
    const longest = matches.reduce((a, b) => (a.length >= b.length ? a : b))
    const clean = longest.replace(/[^0-9.,-]/g, '').replace(/\s+/g, '').replace(',', '.')
    const n = parseFloat(clean)
    return isNaN(n) ? null : n
  }
  return null
}

function hash32(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 2147483647
}

export function mapImagePath(p?: string): string {
  if (!p) return '/image.png'
  const normalized = p.replace(/\\/g, '/').replace(/^\//, '')
  const rel = normalized.startsWith(DATA_IMAGES_PREFIX)
    ? normalized.substring(DATA_IMAGES_PREFIX.length)
    : normalized
  return `/images/${encodeURI(rel)}`
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalize(product: RawProduct): NormalizedProduct {
  const breadcrumbsRaw = (product.breadcrumbs && product.breadcrumbs.length ? product.breadcrumbs : product.category_path) || []
  const breadcrumbs = (breadcrumbsRaw || []).filter(Boolean)
  const cleanedTrail = breadcrumbs
  const brandTrail = cleanedTrail.length > 0 ? String(cleanedTrail[cleanedTrail.length - 1]) : ''
  const category = cleanedTrail.length > 1 ? String(cleanedTrail[cleanedTrail.length - 2]) : (brandTrail || 'Каталог')
  const idSource = product.url || product.name
  const id = hash32(idSource)
  const imagesList = (product.images || []).map(mapImagePath)
  let cover = product.image_cover ? mapImagePath(product.image_cover) : (imagesList[0] || '')
  if (!cover) {
    const last = product.url ? product.url.split('/').pop() || '' : ''
    const fromUrl = last ? slugify(last.replace(/\.[a-z0-9]+$/i, '')) : ''
    const fromName = slugify(product.name)
    const base = fromName || fromUrl || 'image'
    cover = `/images/${base}.jpg`
    const codeSpec = (product.specifications || []).find(s => /(код|арт|sku|№)/i.test(s.name))?.value || ''
    const codeDigits = (codeSpec.match(/\d{5,}/) || [])[0]
    if (codeDigits) {
      cover = `/images/${codeDigits}.jpg`
    }
  }
  const uniqueImages = [cover, ...imagesList].filter((v, i, a) => v && a.indexOf(v) === i)
  const price = toNumberOrNull(product.price_new ?? (product as any).price)
  const priceOld = toNumberOrNull(product.price_old)
  return {
    id,
    name: product.name,
    price,
    priceOld,
    description: (product.description || '').trim(),
    image: cover,
    images: uniqueImages,
    category,
    breadcrumbs: cleanedTrail,
    url: product.url,
    specs: product.specifications,
  }
}

let cache: { at: number; items: NormalizedProduct[] } | null = null
const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes
let imageIndex: { at: number; names: Set<string> } | null = null

async function getImageIndex(): Promise<Set<string>> {
  const now = Date.now()
  if (imageIndex && now - imageIndex.at < CACHE_TTL_MS) return imageIndex.names
  const dir = path.resolve(process.cwd(), 'data', 'images')
  const list = await fs.readdir(dir)
  const set = new Set<string>(list)
  imageIndex = { at: now, names: set }
  return set
}

export async function loadAllProducts(): Promise<NormalizedProduct[]> {
  const now = Date.now()
  if (cache && now - cache.at < CACHE_TTL_MS) return cache.items
  const raw = await fs.readFile(DATA_PRODUCTS_PATH, 'utf8')
  const data = JSON.parse(raw) as RawProduct[]
  const index = await getImageIndex()
  const items = data
    .map(normalize)
    .filter((p) => {
      const rel = p.image.replace(/^\/images\//, '')
      return index.has(decodeURI(rel))
    })
  cache = { at: now, items }
  return items
}

export type Query = {
  q?: string
  category?: string
  sort?: 'name' | 'price-low' | 'price-high'
  offset?: number
  limit?: number
  discounted?: boolean
  brand?: string
}

export async function queryProducts(query: Query) {
  const all = await loadAllProducts()
  const q = (query.q || '').trim().toLowerCase()
  const category = (query.category || '').trim()
  const brand = (query.brand || '').trim()

  const catLower = category.toLowerCase()

  let filtered = all.filter((p) => {
    const matchesQuery = !q
      ? true
      : [
          p.name,
          p.description,
          ...(p.specs?.map((s) => `${s.name} ${s.value}`) || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(q)
    const matchesCategory = !category
      || p.category === category
      || (p.breadcrumbs || []).some((b) => String(b).toLowerCase() === catLower)
      || p.name.toLowerCase().includes(catLower)
    const lastCrumb = (p.breadcrumbs && p.breadcrumbs.length ? p.breadcrumbs[p.breadcrumbs.length - 1] : '')
    const matchesBrand = !brand || lastCrumb === brand
    const isDiscounted = (p.priceOld ?? null) !== null && (p.price ?? null) !== null && (p.priceOld as number) > (p.price as number)
    const matchesDiscount = query.discounted ? isDiscounted : true
    return matchesQuery && matchesCategory && matchesDiscount && matchesBrand
  })

  switch (query.sort) {
    case 'price-low':
      filtered = filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      break
    case 'price-high':
      filtered = filtered.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
      break
    case 'name':
    default:
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  const offset = Math.max(0, query.offset || 0)
  const limit = Math.min(100, Math.max(1, query.limit || 30))
  const total = filtered.length
  const items = filtered.slice(offset, offset + limit)
  return { total, items }
}

export async function getProductById(id: number): Promise<NormalizedProduct | undefined> {
  const all = await loadAllProducts()
  return all.find((p) => p.id === id)
}

export async function listCategories(): Promise<{ name: string; count: number }[]> {
  const all = await loadAllProducts()
  const counts = new Map<string, number>()
  for (const p of all) counts.set(p.category, (counts.get(p.category) || 0) + 1)
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function listCategoriesTree(): Promise<{ name: string; count: number; brands: { name: string; count: number }[] }[]> {
  const all = await loadAllProducts()
  const byCat = new Map<string, Map<string, number>>()
  const catCounts = new Map<string, number>()
  for (const p of all) {
    const cat = p.category
    const trail = p.breadcrumbs || []
    const brandName = trail.length ? trail[trail.length - 1] : ''
    catCounts.set(cat, (catCounts.get(cat) || 0) + 1)
    if (!byCat.has(cat)) byCat.set(cat, new Map<string, number>())
    if (brandName && brandName !== cat) {
      const m = byCat.get(cat)!
      m.set(brandName, (m.get(brandName) || 0) + 1)
    }
  }
  const out: { name: string; count: number; brands: { name: string; count: number }[] }[] = []
  for (const [cat, count] of catCounts.entries()) {
    const brandsMap = byCat.get(cat) || new Map<string, number>()
    const brands = Array.from(brandsMap.entries()).map(([name, c]) => ({ name, count: c })).sort((a,b)=>a.name.localeCompare(b.name))
    out.push({ name: cat, count, brands })
  }
  return out.sort((a,b)=>a.name.localeCompare(b.name))
}





