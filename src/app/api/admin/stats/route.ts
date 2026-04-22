import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [totalUsers, paidUsers, totalWorkoutLogs, topRaw, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isPaid: true } }),
    prisma.workoutLog.count(),
    prisma.workoutLog.groupBy({
      by: ['workoutId'],
      _count: { workoutId: true },
      orderBy: { _count: { workoutId: 'desc' } },
      take: 5,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, isPaid: true },
    }),
  ])

  const workoutIds = topRaw.map((r) => r.workoutId)
  const workouts = await prisma.workout.findMany({
    where: { id: { in: workoutIds } },
    select: { id: true, name: true },
  })

  const topWorkouts = topRaw.map((r) => ({
    name: workouts.find((w) => w.id === r.workoutId)?.name ?? 'Desconhecido',
    count: r._count.workoutId,
  }))

  const totalWorkouts = await prisma.workout.count()
  const usersWithLogs = await prisma.user.count({ where: { workoutLogs: { some: {} } } })
  const completionRate = paidUsers > 0 ? Math.round((usersWithLogs / paidUsers) * 100) : 0

  return NextResponse.json({ totalUsers, paidUsers, totalWorkoutLogs, completionRate, topWorkouts, recentUsers })
}
