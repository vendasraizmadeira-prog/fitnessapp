'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface DashboardData {
  totalWorkouts: number
  completedWorkouts: number
  streak: number
  todayWorkout: { id: string; name: string; dayLabel: string; exerciseCount: number } | null
  recentLogs: { id: string; workout: { name: string }; completedAt: string; caloriesBurned: number | null }[]
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const progressPct = data ? Math.round((data.completedWorkouts / Math.max(data.totalWorkouts, 1)) * 100) : 0
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Atleta'

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-zinc-500 text-sm">{getGreeting()},</p>
        <h1 className="text-3xl font-black">{firstName} 💪</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-zinc-800 rounded w-1/3 mb-3" />
              <div className="h-6 bg-zinc-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-red-500">{progressPct}%</div>
              <div className="text-xs text-zinc-500 mt-1">Progresso</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-white">{data?.completedWorkouts ?? 0}</div>
              <div className="text-xs text-zinc-500 mt-1">Treinos feitos</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-black text-orange-500">{data?.streak ?? 0}</div>
              <div className="text-xs text-zinc-500 mt-1">🔥 Streak</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="card p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold">Progresso do Programa</span>
              <span className="text-sm text-zinc-500">{data?.completedWorkouts}/{data?.totalWorkouts} treinos</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              {progressPct < 25 ? 'Estamos começando! Siga em frente.' :
               progressPct < 50 ? 'Ótimo início! Já está na metade.' :
               progressPct < 75 ? 'Você está indo muito bem!' :
               'Quase lá! Finaliza forte.'}
            </p>
          </div>

          {/* Today's workout */}
          {data?.todayWorkout ? (
            <div className="card p-5 mb-6 border-red-600/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-red">TREINO DO DIA</span>
                </div>
                <h2 className="text-xl font-black mb-1">{data.todayWorkout.name}</h2>
                <p className="text-zinc-500 text-sm mb-4">
                  {data.todayWorkout.dayLabel} · {data.todayWorkout.exerciseCount} exercícios
                </p>
                <Link href={`/treinos/${data.todayWorkout.id}`} className="btn-primary inline-block">
                  Iniciar Treino →
                </Link>
              </div>
            </div>
          ) : (
            <div className="card p-5 mb-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-semibold">Todos os treinos concluídos!</p>
              <p className="text-zinc-500 text-sm mt-1">Novo módulo disponível em breve.</p>
            </div>
          )}

          {/* Recent activity */}
          <div className="card p-5">
            <h3 className="font-bold mb-4">Atividade Recente</h3>
            {data?.recentLogs?.length ? (
              <div className="space-y-3">
                {data.recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{log.workout.name}</div>
                      <div className="text-xs text-zinc-600">
                        {new Date(log.completedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    {log.caloriesBurned && (
                      <span className="text-xs text-orange-400 font-semibold">{log.caloriesBurned} kcal</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-4">
                Nenhum treino realizado ainda. <Link href="/treinos" className="text-red-500">Começar agora →</Link>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
