import fs from 'fs/promises'
import path from 'path'
import { NextRequest } from 'next/server'

const imageDir = path.resolve(process.cwd(), 'data', 'images')
let cachedIndex: string[] | null = null

async function ensureIndex() {
  if (cachedIndex) return cachedIndex
  const entries = await fs.readdir(imageDir)
  cachedIndex = entries
  return cachedIndex
}

function contentTypeFor(p: string) {
  const ext = path.extname(p).toLowerCase()
  return ext === '.jpg' || ext === '.jpeg'
    ? 'image/jpeg'
    : ext === '.png'
    ? 'image/png'
    : ext === '.webp'
    ? 'image/webp'
    : 'application/octet-stream'
}

async function tryRead(rel: string) {
  const safePath = path.resolve(imageDir, rel)
  if (!safePath.startsWith(imageDir)) return null
  try {
    const data = await fs.readFile(safePath)
    return { data, filePath: safePath }
  } catch {
    return null
  }
}

function stripSizeSuffix(stem: string) {
  // remove -250x250 or -800x600 like suffixes if present
  return stem.replace(/-\d+x\d+$/i, '')
}

export async function GET(_req: NextRequest, ctx: { params: { slug: string[] } | Promise<{ slug: string[] }> }) {
  const p = 'then' in ctx.params ? await ctx.params : ctx.params
  const parts = p.slug || []
  const rel = parts.join('/')
  // First, try exact
  let res = await tryRead(rel)
  if (res) {
    return new Response(res.data, {
      status: 200,
      headers: {
        'Content-Type': contentTypeFor(res.filePath),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  // Try alternate extensions and size-less stems
  const ext = path.extname(rel)
  const stem = rel.slice(0, -ext.length)
  const stemNoSize = stripSizeSuffix(stem)
  const candidates = [
    `${stem}${ext}`,
    `${stemNoSize}${ext}`,
    `${stem}.jpg`,
    `${stemNoSize}.jpg`,
    `${stem}.jpeg`,
    `${stemNoSize}.jpeg`,
    `${stem}.png`,
    `${stemNoSize}.png`,
    `${stem}.webp`,
    `${stemNoSize}.webp`,
    `${stem}.jpg.webp`,
    `${stemNoSize}.jpg.webp`,
    `${stem}.jpeg.webp`,
    `${stemNoSize}.jpeg.webp`,
    `${stem}.png.webp`,
    `${stemNoSize}.png.webp`,
  ]
  for (const c of candidates) {
    res = await tryRead(c)
    if (res) {
      return new Response(res.data, {
        status: 200,
        headers: {
          'Content-Type': contentTypeFor(res.filePath),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }

  // Last resort: scan index by prefix (expensive but cached)
  const idx = await ensureIndex()
  const baseName = path.basename(stemNoSize)
  let file = idx.find((f) => f.startsWith(baseName))
  if (!file) {
    const reqTokens = baseName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
    let best: { f: string; score: number } | null = null
    for (const f of idx) {
      const candTokens = f.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
      let score = 0
      for (const t of reqTokens) if (candTokens.includes(t)) score++
      if (score > 0 && (!best || score > best.score)) best = { f, score }
    }
    file = best?.f
    // if name is mostly digits, try substring match
    if (!file && /\d{5,}/.test(baseName)) {
      file = idx.find(f => f.includes(baseName)) || undefined
    }
  }
  if (file) {
    const data = await fs.readFile(path.resolve(imageDir, file))
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentTypeFor(file),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  return new Response('Not found', { status: 404 })
}
