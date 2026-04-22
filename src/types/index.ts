export type Role = 'USER' | 'ADMIN'
export type Goal = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'ENDURANCE' | 'GENERAL_FITNESS'
export type Intensity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Exercise {
  id: string
  name: string
  videoUrl: string | null
  sets: number
  reps: string
  restTime: number
  order: number
  intensity: Intensity
}

export interface Workout {
  id: string
  name: string
  dayLabel: string
  order: number
  exercises: Exercise[]
}

export interface Module {
  id: string
  name: string
  weekStart: number
  weekEnd: number
  order: number
  workouts: Workout[]
}

export interface Program {
  id: string
  name: string
  description: string | null
  durationWeeks: number
  modules: Module[]
}

export interface WorkoutLog {
  id: string
  workoutId: string
  durationMinutes: number | null
  caloriesBurned: number | null
  completedAt: string
  workout: { name: string }
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  weight: number | null
  height: number | null
  goal: Goal | null
  isPaid: boolean
  role: Role
  createdAt: string
}

export const GOAL_LABELS: Record<Goal, string> = {
  WEIGHT_LOSS: 'Emagrecimento',
  MUSCLE_GAIN: 'Ganho de Massa',
  ENDURANCE: 'Resistência',
  GENERAL_FITNESS: 'Condicionamento Geral',
}

export const INTENSITY_LABELS: Record<Intensity, string> = {
  LOW: 'Leve',
  MEDIUM: 'Moderado',
  HIGH: 'Intenso',
}

// Cal/min estimates per intensity
export const CALORIES_PER_MIN: Record<Intensity, number> = {
  LOW: 4,
  MEDIUM: 7,
  HIGH: 10,
}
