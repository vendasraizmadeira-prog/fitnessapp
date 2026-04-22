import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_email ?? session.customer_details?.email
    const userId = session.metadata?.userId

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPaid: true,
          stripeCustomerId: session.customer as string | null,
        },
      })
    } else if (customerEmail) {
      await prisma.user.updateMany({
        where: { email: customerEmail },
        data: { isPaid: true, stripeCustomerId: session.customer as string | null },
      })
    }
  }

  return NextResponse.json({ received: true })
}
