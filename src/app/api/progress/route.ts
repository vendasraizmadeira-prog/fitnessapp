import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const logs = await prisma.workoutLog.findMany({
    where: { userId: session.user.id },
    include: { workout: { select: { name: true } } },
    orderBy: { completedAt: 'desc' },
    take: 100,
  })

  return NextResponse.json(logs)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { workoutId, durationMinutes, caloriesBurned } = await req.json()

  if (!workoutId) return NextResponse.json({ error: 'workoutId required' }, { status: 400 })

  const log = await prisma.workoutLog.create({
    data: {
      userId: session.user.id,
      workoutId,
      durationMinutes: durationMinutes ?? null,
      caloriesBurned: caloriesBurned ?? null,
    },
  })

  return NextResponse.json(log, { status: 201 })
}
