'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LogEntry {
  id: string
  workoutId: string
  workout: { name: string }
  completedAt: string
  durationMinutes: number | null
  caloriesBurned: number | null
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function AgendaPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [now] = useState(new Date())
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  useEffect(() => {
    fetch('/api/progress')
      .then((r) => r.json())
      .then((d) => { setLogs(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const logsByDate = logs.reduce<Record<string, LogEntry[]>>((acc, log) => {
    const key = new Date(log.completedAt).toISOString().slice(0, 10)
    if (!acc[key]) acc[key] = []
    acc[key].push(log)
    return acc
  }, {})

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const totalCalories = logs.reduce((a, l) => a + (l.caloriesBurned ?? 0), 0)
  const streak = calcStreak(logs)

  const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Agenda</h1>
        <p className="text-zinc-500 text-sm mt-1">Histórico e acompanhamento diário</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-black text-orange-500">{streak}</div>
          <div className="text-xs text-zinc-500 mt-1">🔥 Streak</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-black text-white">{logs.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Treinos</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-black text-red-500">{totalCalories.toLocaleString('pt-BR')}</div>
          <div className="text-xs text-zinc-500 mt-1">Kcal total</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="text-zinc-500 hover:text-white p-1">◀</button>
          <span className="font-bold">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="text-zinc-500 hover:text-white p-1">▶</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['D','S','T','Q','Q','S','S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-zinc-600 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const hasLog = !!logsByDate[dateKey]
            const isToday = dateKey === now.toISOString().slice(0, 10)

            return (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  hasLog ? 'bg-red-600 text-white' :
                  isToday ? 'border border-red-600 text-red-500' :
                  'text-zinc-600 hover:bg-zinc-800'
                }`}
              >
                {day}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-600 rounded" /> Treino feito</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 border border-red-600 rounded" /> Hoje</div>
        </div>
      </div>

      {/* Log list */}
      <div className="card p-5">
        <h3 className="font-bold mb-4">Histórico Completo</h3>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-zinc-800 rounded-lg" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-zinc-500 text-sm mb-3">Nenhum treino registrado ainda.</p>
            <Link href="/treinos" className="text-red-500 text-sm hover:text-red-400">Começar primeiro treino →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {[...logs].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
              .slice(0, 20)
              .map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0">
                <div>
                  <div className="font-medium text-sm">{log.workout.name}</div>
                  <div className="text-xs text-zinc-600">
                    {new Date(log.completedAt).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    {log.durationMinutes ? ` · ${log.durationMinutes} min` : ''}
                  </div>
                </div>
                {log.caloriesBurned ? (
                  <span className="text-xs text-orange-400 font-semibold">{log.caloriesBurned} kcal</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function calcStreak(logs: LogEntry[]): number {
  if (!logs.length) return 0
  const dates = [...new Set(logs.map((l) => new Date(l.completedAt).toISOString().slice(0, 10)))]
    .sort((a, b) => b.localeCompare(a))

  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)

  for (const dateStr of dates) {
    const d = new Date(dateStr)
    const diff = Math.round((current.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    streak++
    current = d
  }

  return streak
}
