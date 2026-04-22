import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { name, videoUrl, sets, reps, restTime, intensity, order } = await req.json()

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const exercise = await prisma.exercise.create({
    data: {
      name,
      videoUrl: videoUrl || null,
      sets: parseInt(sets),
      reps: reps || '12',
      restTime: parseInt(restTime) || 60,
      intensity: intensity || 'MEDIUM',
      order: parseInt(order) || 1,
      workoutId: id,
    },
  })

  return NextResponse.json(exercise, { status: 201 })
}
