import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [logs, allWorkouts] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId: session.user.id },
      include: { workout: { select: { name: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10,
    }),
    prisma.workout.findMany({ select: { id: true } }),
  ])

  const completedIds = new Set(logs.map((l) => l.workoutId))

  // Streak
  const dates = [...new Set(logs.map((l) => new Date(l.completedAt).toISOString().slice(0, 10)))]
    .sort((a, b) => b.localeCompare(a))
  let streak = 0
  let cur = new Date(); cur.setHours(0,0,0,0)
  for (const ds of dates) {
    const d = new Date(ds)
    const diff = Math.round((cur.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    streak++; cur = d
  }

  // Next workout not yet done
  const allOrdered = await prisma.workout.findMany({
    orderBy: [{ module: { order: 'asc' } }, { order: 'asc' }],
    include: { _count: { select: { exercises: true } } },
    take: 50,
  })
  const todayWorkout = allOrdered.find((w) => !completedIds.has(w.id))

  return NextResponse.json({
    totalWorkouts: allWorkouts.length,
    completedWorkouts: completedIds.size,
    streak,
    todayWorkout: todayWorkout
      ? { id: todayWorkout.id, name: todayWorkout.name, dayLabel: todayWorkout.dayLabel, exerciseCount: todayWorkout._count.exercises }
      : null,
    recentLogs: logs.slice(0, 5),
  })
}
