'use client'

import { useEffect, useState } from 'react'
import { GOAL_LABELS, type Goal } from '@/types'

interface AdminUser {
  id: string
  name: string | null
  email: string
  role: string
  isPaid: boolean
  goal: Goal | null
  weight: number | null
  height: number | null
  createdAt: string
  _count: { workoutLogs: number }
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'paid' | 'free'>('all')
  const [selected, setSelected] = useState<AdminUser | null>(null)

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => { setUsers(d); setLoading(false) })
  }, [])

  const filtered = users.filter((u) => {
    const matchSearch = u.email.includes(search) || u.name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'paid' ? u.isPaid : !u.isPaid)
    return matchSearch && matchFilter
  })

  async function togglePaid(userId: string, current: boolean) {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid: !current }),
    })
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isPaid: !current } : u))
    if (selected?.id === userId) setSelected((p) => p ? { ...p, isPaid: !current } : null)
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Usuários</h1>
        <p className="text-zinc-500 text-sm mt-1">{users.length} cadastrados · {users.filter(u => u.isPaid).length} pagos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="input-field max-w-xs text-sm py-2"
          placeholder="Buscar por email ou nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {(['all', 'paid', 'free'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-red-600 text-white' : 'btn-secondary'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'paid' ? 'Pagos' : 'Free'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User list */}
        <div className="lg:col-span-2 card overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-zinc-800 rounded" />)}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-zinc-600">Nenhum usuário encontrado.</div>
              ) : filtered.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelected(u)}
                  className={`w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors text-left ${
                    selected?.id === u.id ? 'bg-red-600/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {u.name?.charAt(0)?.toUpperCase() || u.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{u.name || 'Sem nome'}</div>
                      <div className="text-xs text-zinc-600">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">{u._count.workoutLogs} treinos</span>
                    <span className={u.isPaid ? 'badge-green' : 'badge-zinc'}>{u.isPaid ? 'Pago' : 'Free'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User detail */}
        <div>
          {!selected ? (
            <div className="card p-6 text-center text-zinc-600 text-sm">
              Clique em um usuário para ver detalhes.
            </div>
          ) : (
            <div className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center text-lg font-black text-red-400">
                  {selected.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="font-bold">{selected.name || 'Sem nome'}</div>
                  <div className="text-xs text-zinc-600">{selected.email}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className={selected.isPaid ? 'text-emerald-400' : 'text-zinc-400'}>
                    {selected.isPaid ? 'Pago ✓' : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Role</span>
                  <span>{selected.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Treinos feitos</span>
                  <span>{selected._count.workoutLogs}</span>
                </div>
                {selected.goal && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Objetivo</span>
                    <span>{GOAL_LABELS[selected.goal]}</span>
                  </div>
                )}
                {selected.weight && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Peso</span>
                    <span>{selected.weight} kg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-500">Cadastro</span>
                  <span className="text-xs">{new Date(selected.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <button
                onClick={() => togglePaid(selected.id, selected.isPaid)}
                className={`w-full text-sm py-2.5 rounded-lg font-semibold transition-colors ${
                  selected.isPaid
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                }`}
              >
                {selected.isPaid ? 'Revogar Acesso' : 'Liberar Acesso'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
