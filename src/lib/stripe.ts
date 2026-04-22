import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export function extractYouTubeId(url: string): string {
  if (!url) return ''
  // Already an ID (no slashes or dots)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? url
}
