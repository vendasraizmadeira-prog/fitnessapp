import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const modules = await prisma.module.findMany({
    orderBy: { order: 'asc' },
    include: {
      workouts: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { exercises: true } } },
      },
    },
  })

  return NextResponse.json(modules)
}
