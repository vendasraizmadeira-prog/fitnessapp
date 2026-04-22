import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, weight: true, height: true, goal: true, isPaid: true, role: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, weight, height, goal } = await req.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name || null, weight: weight ?? null, height: height ?? null, goal: goal || null },
    select: { id: true, name: true, email: true, weight: true, height: true, goal: true },
  })

  return NextResponse.json(user)
}
