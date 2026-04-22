import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { isPaid, role } = await req.json()
  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(isPaid !== undefined ? { isPaid } : {}),
      ...(role !== undefined ? { role } : {}),
    },
  })

  return NextResponse.json(user)
}
