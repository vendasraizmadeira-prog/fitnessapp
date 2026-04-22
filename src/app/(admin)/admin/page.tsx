'use client'

import { useEffect, useState } from 'react'

interface AdminStats {
  totalUsers: number
  paidUsers: number
  totalWorkoutLogs: number
  completionRate: number
  topWorkouts: { name: string; count: number }[]
  recentUsers: { id: string; name: string | null; email: string; createdAt: string; isPaid: boolean }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Dashboard Admin</h1>
        <p className="text-zinc-500 text-sm mt-1">Visão geral da plataforma</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse"><div className="h-8 bg-zinc-800 rounded" /></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Usuários Totais', value: stats?.totalUsers ?? 0, icon: '👥', color: 'text-white' },
              { label: 'Usuários Pagos', value: stats?.paidUsers ?? 0, icon: '💳', color: 'text-emerald-400' },
              { label: 'Treinos Realizados', value: stats?.totalWorkoutLogs ?? 0, icon: '🏋️', color: 'text-red-400' },
              { label: 'Taxa de Conclusão', value: `${stats?.completionRate ?? 0}%`, icon: '📊', color: 'text-yellow-400' },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-zinc-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-bold mb-4">Treinos Mais Realizados</h3>
              <div className="space-y-3">
                {stats?.topWorkouts?.length ? stats.topWorkouts.map((w, i) => (
                  <div key={w.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 text-sm w-5">{i + 1}.</span>
                      <span className="text-sm">{w.name}</span>
                    </div>
                    <span className="text-xs text-zinc-500">{w.count}x</span>
                  </div>
                )) : <p className="text-zinc-600 text-sm">Nenhum dado ainda.</p>}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-bold mb-4">Últimos Cadastros</h3>
              <div className="space-y-3">
                {stats?.recentUsers?.length ? stats.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{u.name || 'Sem nome'}</div>
                      <div className="text-xs text-zinc-600 truncate max-w-[160px]">{u.email}</div>
                    </div>
                    <span className={u.isPaid ? 'badge-green' : 'badge-zinc'}>
                      {u.isPaid ? 'Pago' : 'Free'}
                    </span>
                  </div>
                )) : <p className="text-zinc-600 text-sm">Nenhum usuário ainda.</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
