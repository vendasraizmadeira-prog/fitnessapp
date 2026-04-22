'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Module } from '@/types'

interface WorkoutWithStatus {
  id: string
  name: string
  dayLabel: string
  order: number
  exerciseCount: number
  isCompleted: boolean
}

interface ModuleWithStatus extends Omit<Module, 'workouts'> {
  workouts: WorkoutWithStatus[]
}

const INTENSITY_COLOR: Record<string, string> = {
  LOW: 'text-blue-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-red-400',
}

export default function TreinosPage() {
  const [modules, setModules] = useState<ModuleWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [openModule, setOpenModule] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/workouts')
      .then((r) => r.json())
      .then((d) => {
        setModules(d)
        if (d.length > 0) setOpenModule(d[0].id)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Treinos</h1>
        <p className="text-zinc-500 text-sm mt-1">Programa de 12 semanas · 4 módulos</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-zinc-800 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : modules.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-zinc-500">Nenhum treino disponível ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => {
            const completedCount = mod.workouts.filter((w) => w.isCompleted).length
            const isOpen = openModule === mod.id

            return (
              <div key={mod.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenModule(isOpen ? null : mod.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white">{mod.name}</span>
                      <span className="badge-zinc">Semanas {mod.weekStart}–{mod.weekEnd}</span>
                    </div>
                    <div className="text-xs text-zinc-600">
                      {completedCount}/{mod.workouts.length} treinos concluídos
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{ width: `${(completedCount / Math.max(mod.workouts.length, 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-zinc-500 text-sm">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-zinc-800 divide-y divide-zinc-800/50">
                    {mod.workouts.map((workout) => (
                      <Link
                        key={workout.id}
                        href={`/treinos/${workout.id}`}
                        className="flex items-center justify-between px-5 py-4 hover:bg-zinc-800/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                            workout.isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-zinc-700 text-zinc-600'
                          }`}>
                            {workout.isCompleted ? '✓' : workout.order}
                          </div>
                          <div>
                            <div className="font-semibold text-sm group-hover:text-white transition-colors">
                              {workout.name}
                            </div>
                            <div className="text-xs text-zinc-600">{workout.dayLabel} · {workout.exerciseCount} exercícios</div>
                          </div>
                        </div>
                        <span className="text-zinc-600 group-hover:text-red-500 transition-colors text-sm">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
