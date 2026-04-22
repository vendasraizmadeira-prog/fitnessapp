'use client'

import { useEffect, useState } from 'react'

interface ExerciseForm {
  name: string
  videoUrl: string
  sets: number
  reps: string
  restTime: number
  intensity: string
  order: number
}

interface WorkoutFull {
  id: string
  name: string
  dayLabel: string
  exercises: (ExerciseForm & { id: string })[]
  module: { name: string }
}

interface ModuleFull {
  id: string
  name: string
  weekStart: number
  weekEnd: number
  workouts: { id: string; name: string; dayLabel: string; _count: { exercises: number } }[]
}

const defaultExercise = (): ExerciseForm => ({
  name: '', videoUrl: '', sets: 3, reps: '12', restTime: 60, intensity: 'MEDIUM', order: 1,
})

export default function AdminTreinosPage() {
  const [modules, setModules] = useState<ModuleFull[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [newExercise, setNewExercise] = useState<ExerciseForm>(defaultExercise())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function loadModules() {
    fetch('/api/admin/workouts')
      .then((r) => r.json())
      .then((d) => { setModules(d); setLoading(false) })
  }

  useEffect(() => { loadModules() }, [])

  function openWorkout(id: string) {
    fetch(`/api/workouts/${id}`)
      .then((r) => r.json())
      .then(setSelectedWorkout)
  }

  async function addExercise() {
    if (!selectedWorkout) return
    setSaving(true)
    const res = await fetch(`/api/admin/workouts/${selectedWorkout.id}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExercise),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('Exercício adicionado!')
      setShowAddExercise(false)
      setNewExercise(defaultExercise())
      openWorkout(selectedWorkout.id)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function deleteExercise(exerciseId: string) {
    if (!confirm('Remover este exercício?')) return
    await fetch(`/api/admin/exercises/${exerciseId}`, { method: 'DELETE' })
    if (selectedWorkout) openWorkout(selectedWorkout.id)
  }

  function updateEx(field: string, value: string | number) {
    setNewExercise((p) => ({ ...p, [field]: value }))
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Gerenciar Treinos</h1>
        <p className="text-zinc-500 text-sm mt-1">Módulos, treinos e exercícios</p>
      </div>

      {msg && (
        <div className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-4">
          ✓ {msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: module/workout tree */}
        <div className="space-y-3">
          {loading ? (
            <div className="card p-5 animate-pulse"><div className="h-5 bg-zinc-800 rounded w-1/2" /></div>
          ) : modules.map((mod) => (
            <div key={mod.id} className="card overflow-hidden">
              <div className="p-4 bg-zinc-800/50 border-b border-zinc-800">
                <div className="font-bold text-sm">{mod.name}</div>
                <div className="text-xs text-zinc-600">Semanas {mod.weekStart}–{mod.weekEnd}</div>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {mod.workouts.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => openWorkout(w.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors text-left ${
                      selectedWorkout?.id === w.id ? 'bg-red-600/10 border-l-2 border-red-600' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{w.name}</div>
                      <div className="text-xs text-zinc-600">{w.dayLabel} · {w._count.exercises} exercícios</div>
                    </div>
                    <span className="text-zinc-600 text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: workout detail */}
        <div>
          {!selectedWorkout ? (
            <div className="card p-8 text-center text-zinc-600">
              Selecione um treino à esquerda para editar.
            </div>
          ) : (
            <div className="card">
              <div className="p-5 border-b border-zinc-800">
                <h3 className="font-bold">{selectedWorkout.name}</h3>
                <p className="text-xs text-zinc-600">{selectedWorkout.module?.name}</p>
              </div>

              <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
                {selectedWorkout.exercises.sort((a, b) => a.order - b.order).map((ex, i) => (
                  <div key={ex.id} className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{ex.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {ex.sets} séries × {ex.reps} reps · {ex.restTime}s descanso
                        </div>
                        {ex.videoUrl && (
                          <div className="text-xs text-blue-400 mt-0.5 truncate max-w-[200px]">{ex.videoUrl}</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteExercise(ex.id)}
                        className="text-zinc-600 hover:text-red-500 text-sm ml-2 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {selectedWorkout.exercises.length === 0 && (
                  <p className="text-zinc-600 text-sm text-center py-4">Nenhum exercício. Adicione abaixo.</p>
                )}
              </div>

              {showAddExercise ? (
                <div className="p-5 border-t border-zinc-800 space-y-3">
                  <h4 className="font-semibold text-sm">Novo Exercício</h4>
                  <input className="input-field text-sm py-2" placeholder="Nome do exercício *" value={newExercise.name} onChange={(e) => updateEx('name', e.target.value)} />
                  <input className="input-field text-sm py-2" placeholder="ID ou URL do YouTube" value={newExercise.videoUrl} onChange={(e) => updateEx('videoUrl', e.target.value)} />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-zinc-600">Séries</label>
                      <input type="number" className="input-field text-sm py-2" value={newExercise.sets} onChange={(e) => updateEx('sets', parseInt(e.target.value))} min={1} max={10} />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-600">Reps</label>
                      <input className="input-field text-sm py-2" value={newExercise.reps} onChange={(e) => updateEx('reps', e.target.value)} placeholder="12" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-600">Descanso (s)</label>
                      <input type="number" className="input-field text-sm py-2" value={newExercise.restTime} onChange={(e) => updateEx('restTime', parseInt(e.target.value))} min={15} />
                    </div>
                  </div>
                  <select className="input-field text-sm py-2" value={newExercise.intensity} onChange={(e) => updateEx('intensity', e.target.value)}>
                    <option value="LOW">Leve</option>
                    <option value="MEDIUM">Moderado</option>
                    <option value="HIGH">Intenso</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={addExercise} disabled={saving || !newExercise.name} className="btn-primary flex-1 py-2 text-sm">
                      {saving ? 'Salvando...' : 'Adicionar'}
                    </button>
                    <button onClick={() => setShowAddExercise(false)} className="btn-secondary flex-1 py-2 text-sm">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="p-5 border-t border-zinc-800">
                  <button onClick={() => setShowAddExercise(true)} className="btn-secondary w-full text-sm py-2.5">
                    + Adicionar Exercício
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
