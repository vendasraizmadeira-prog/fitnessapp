import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const logs = await prisma.workoutLog.findMany({
    where: { userId: session.user.id },
    select: { workoutId: true },
  })
  const completedIds = new Set(logs.map((l) => l.workoutId))

  const modules = await prisma.module.findMany({
    orderBy: { order: 'asc' },
    include: {
      workouts: {
        orderBy: { order: 'asc' },
        include: { _count: { select: { exercises: true } } },
      },
    },
  })

  const result = modules.map((mod) => ({
    ...mod,
    workouts: mod.workouts.map((w) => ({
      id: w.id,
      name: w.name,
      dayLabel: w.dayLabel,
      order: w.order,
      exerciseCount: w._count.exercises,
      isCompleted: completedIds.has(w.id),
    })),
  }))

  return NextResponse.json(result)
}
