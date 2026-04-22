import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: { orderBy: { order: 'asc' } },
      module: { select: { name: true } },
    },
  })

  if (!workout) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(workout)
}
