import { NextRequest } from 'next/server'
import { getProductById } from '@/lib/products'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> | { id: string } }) {
  const p = 'then' in ctx.params ? await ctx.params : ctx.params
  const id = Number(p.id)
  if (!Number.isFinite(id)) return new Response('Bad Request', { status: 400 })
  const product = await getProductById(id)
  if (!product) return new Response('Not Found', { status: 404 })
  return Response.json(product)
}
