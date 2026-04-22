'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Workout, Exercise } from '@/types'
import { CALORIES_PER_MIN } from '@/types'

type Phase = 'overview' | 'workout' | 'complete'

interface SessionState {
  phase: Phase
  exerciseIdx: number
  setIdx: number
  completedSets: boolean[][]
  isResting: boolean
  restLeft: number
  startedAt: number | null
  finishedAt: number | null
}

function extractYouTubeId(url: string): string {
  if (!url) return ''
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] ?? ''
}

function playBeep(freq = 880, duration = 150) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {/* ignore if audio not available */}
}

function calcCalories(workout: Workout, durationMin: number): number {
  const intensities = workout.exercises.map((e) => e.intensity)
  const dominant = intensities.reduce((acc, i) => {
    acc[i] = (acc[i] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const top = Object.entries(dominant).sort((a, b) => b[1] - a[1])[0][0] as keyof typeof CALORIES_PER_MIN
  return Math.round(CALORIES_PER_MIN[top] * durationMin)
}

export default function WorkoutSessionPage() {
  const { workoutId } = useParams<{ workoutId: string }>()
  const router = useRouter()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [state, setState] = useState<SessionState>({
    phase: 'overview',
    exerciseIdx: 0,
    setIdx: 0,
    completedSets: [],
    isResting: false,
    restLeft: 0,
    startedAt: null,
    finishedAt: null,
  })

  useEffect(() => {
    fetch(`/api/workouts/${workoutId}`)
      .then((r) => r.json())
      .then((w: Workout) => {
        setWorkout(w)
        setState((s) => ({
          ...s,
          completedSets: w.exercises.map((e) => Array(e.sets).fill(false)),
        }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [workoutId])

  // Rest timer
  useEffect(() => {
    if (!state.isResting || state.restLeft <= 0) return

    timerRef.current = setTimeout(() => {
      setState((s) => {
        const next = s.restLeft - 1
        if (next <= 3 && next > 0) playBeep(440, 100)
        if (next === 0) {
          playBeep(880, 300)
          return { ...s, isResting: false, restLeft: 0 }
        }
        return { ...s, restLeft: next }
      })
    }, 1000)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [state.isResting, state.restLeft])

  function startWorkout() {
    setState((s) => ({ ...s, phase: 'workout', startedAt: Date.now() }))
  }

  function completeSet() {
    const ex = workout!.exercises[state.exerciseIdx]
    const newCompleted = state.completedSets.map((arr, i) =>
      i === state.exerciseIdx ? arr.map((v, j) => (j === state.setIdx ? true : v)) : arr
    )

    const isLastSet = state.setIdx >= ex.sets - 1
    const isLastExercise = state.exerciseIdx >= workout!.exercises.length - 1

    if (isLastSet && isLastExercise) {
      const finishedAt = Date.now()
      const durationMin = Math.round(((finishedAt - state.startedAt!) / 1000) / 60)
      const calories = calcCalories(workout!, Math.max(durationMin, 1))

      setState((s) => ({ ...s, completedSets: newCompleted, phase: 'complete', finishedAt, isResting: false }))
      saveLog(durationMin, calories)
      return
    }

    if (isLastSet) {
      // Move to next exercise after rest
      setState((s) => ({
        ...s,
        completedSets: newCompleted,
        isResting: true,
        restLeft: ex.restTime,
        exerciseIdx: s.exerciseIdx + 1,
        setIdx: 0,
      }))
    } else {
      // Next set after rest
      setState((s) => ({
        ...s,
        completedSets: newCompleted,
        isResting: true,
        restLeft: ex.restTime,
        setIdx: s.setIdx + 1,
      }))
    }
  }

  function skipRest() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setState((s) => ({ ...s, isResting: false, restLeft: 0 }))
  }

  async function saveLog(duration: number, calories: number) {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workoutId, durationMinutes: duration, caloriesBurned: calories }),
    }).catch(() => {})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500 animate-pulse">Carregando treino...</div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-zinc-500">Treino não encontrado.</p>
        <button onClick={() => router.back()} className="btn-secondary">Voltar</button>
      </div>
    )
  }

  const currentExercise = workout.exercises[state.exerciseIdx]
  const totalSets = workout.exercises.reduce((a, e) => a + e.sets, 0)
  const doneSets = state.completedSets.flat().filter(Boolean).length
  const progressPct = Math.round((doneSets / totalSets) * 100)
  const videoId = extractYouTubeId(currentExercise?.videoUrl ?? '')

  // ── OVERVIEW ───────────────────────────────────────────────
  if (state.phase === 'overview') {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-zinc-500 hover:text-white text-sm mb-6 flex items-center gap-1">
          ← Voltar
        </button>

        <div className="mb-6">
          <span className="badge-zinc mb-2 inline-block">VISÃO GERAL</span>
          <h1 className="text-3xl font-black">{workout.name}</h1>
          <p className="text-zinc-500 text-sm mt-1">{workout.exercises.length} exercícios · ~{workout.exercises.reduce((a, e) => a + e.sets * (e.restTime / 60 + 1), 0).toFixed(0)} min</p>
        </div>

        <div className="space-y-2 mb-8">
          {workout.exercises.map((ex, i) => (
            <div key={ex.id} className="card p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-sm font-bold text-zinc-400">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{ex.name}</div>
                <div className="text-xs text-zinc-600">{ex.sets} séries × {ex.reps} reps · {ex.restTime}s descanso</div>
              </div>
              <span className={`text-xs font-semibold ${
                ex.intensity === 'HIGH' ? 'text-red-400' : ex.intensity === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {ex.intensity === 'HIGH' ? '🔥' : ex.intensity === 'MEDIUM' ? '⚡' : '💧'}
              </span>
            </div>
          ))}
        </div>

        <button onClick={startWorkout} className="btn-primary w-full text-lg py-4">
          🚀 Iniciar Treino
        </button>
      </div>
    )
  }

  // ── COMPLETE ───────────────────────────────────────────────
  if (state.phase === 'complete') {
    const durationMin = Math.round(((state.finishedAt! - state.startedAt!) / 1000) / 60)
    const calories = calcCalories(workout, Math.max(durationMin, 1))

    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto flex flex-col items-center text-center pt-16">
        <div className="text-6xl mb-4">🏆</div>
        <h1 className="text-3xl font-black mb-2">Treino Concluído!</h1>
        <p className="text-zinc-500 mb-8">{workout.name}</p>

        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-red-500">{calories}</div>
            <div className="text-xs text-zinc-500 mt-1">Calorias</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-white">{durationMin}'</div>
            <div className="text-xs text-zinc-500 mt-1">Duração</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-black text-emerald-500">{doneSets}</div>
            <div className="text-xs text-zinc-500 mt-1">Séries</div>
          </div>
        </div>

        <div className="card p-5 w-full mb-6">
          <div className="text-sm text-zinc-400 text-left">
            {calories > 400 ? '🔥 Treino de alta intensidade! Ótimo trabalho.' :
             calories > 250 ? '⚡ Bom treino! Continue assim.' :
             '💧 Treino leve concluído. Progresso garantido!'}
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button onClick={() => router.push('/treinos')} className="btn-secondary flex-1">
            Ver Treinos
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-primary flex-1">
            Dashboard →
          </button>
        </div>
      </div>
    )
  }

  // ── WORKOUT ───────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen">
      {/* Progress bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="text-zinc-600 hover:text-white text-sm">✕</button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-zinc-600 mb-1">
              <span>{workout.name}</span>
              <span>{doneSets}/{totalSets} séries</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div className="bg-red-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
        {/* Exercise counter */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-zinc-500 text-sm">Exercício {state.exerciseIdx + 1} de {workout.exercises.length}</span>
          <span className="badge-zinc">
            {currentExercise.intensity === 'HIGH' ? '🔥 Intenso' : currentExercise.intensity === 'MEDIUM' ? '⚡ Moderado' : '💧 Leve'}
          </span>
        </div>

        {/* Exercise name */}
        <h2 className="text-2xl font-black mb-4">{currentExercise.name}</h2>

        {/* Video */}
        {videoId ? (
          <div className="relative w-full mb-5 rounded-xl overflow-hidden bg-zinc-900" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-zinc-900 rounded-xl flex items-center justify-center mb-5 text-zinc-600 text-sm">
            🎬 Vídeo não disponível
          </div>
        )}

        {/* Sets info */}
        <div className="card p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-3xl font-black">{currentExercise.reps}</span>
              <span className="text-zinc-500 ml-2 text-sm">repetições</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{state.setIdx + 1}/{currentExercise.sets}</div>
              <div className="text-xs text-zinc-600">séries</div>
            </div>
          </div>

          {/* Set dots */}
          <div className="flex gap-2 mb-4">
            {Array.from({ length: currentExercise.sets }).map((_, i) => {
              const done = state.completedSets[state.exerciseIdx]?.[i]
              const active = i === state.setIdx && !state.isResting
              return (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    done ? 'bg-emerald-500' : active ? 'bg-red-500 animate-pulse' : 'bg-zinc-800'
                  }`}
                />
              )
            })}
          </div>

          {!state.isResting && (
            <div className="text-xs text-zinc-600 text-center">
              ⏸ Descanso após série: {currentExercise.restTime}s
            </div>
          )}
        </div>

        {/* REST TIMER */}
        {state.isResting ? (
          <div className="card p-6 text-center mb-4 border-orange-800/30">
            <div className="text-zinc-400 text-sm mb-2">⏳ Descansando...</div>
            <div className={`text-6xl font-black mb-4 tabular-nums ${
              state.restLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'
            }`}>
              {state.restLeft}s
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(state.restLeft / currentExercise.restTime) * 100}%` }}
              />
            </div>
            <button onClick={skipRest} className="text-sm text-zinc-500 hover:text-white transition-colors">
              Pular descanso →
            </button>
          </div>
        ) : (
          <button
            onClick={completeSet}
            className="btn-primary w-full text-lg py-5 rounded-xl glow-red"
          >
            ✓ Concluir Série {state.setIdx + 1}
          </button>
        )}

        {/* Exercise navigation dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {workout.exercises.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === state.exerciseIdx ? 'bg-red-500 w-4' :
                state.completedSets[i]?.every(Boolean) ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
