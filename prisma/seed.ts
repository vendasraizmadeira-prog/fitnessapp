import { PrismaClient, Intensity } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@fitpro.com' },
    update: {},
    create: {
      email: 'admin@fitpro.com',
      name: 'Admin FitPro',
      password: adminPassword,
      role: 'ADMIN',
      isPaid: true,
    },
  })

  // Demo user
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.upsert({
    where: { email: 'demo@fitpro.com' },
    update: {},
    create: {
      email: 'demo@fitpro.com',
      name: 'Demo User',
      password: userPassword,
      role: 'USER',
      isPaid: true,
      weight: 80,
      height: 175,
      goal: 'MUSCLE_GAIN',
    },
  })

  // Program
  const program = await prisma.program.upsert({
    where: { id: 'prog_fitpro_12w' },
    update: {},
    create: {
      id: 'prog_fitpro_12w',
      name: 'FitPro 12 Semanas',
      description: 'O programa definitivo para transformar seu corpo em 12 semanas.',
      durationWeeks: 12,
    },
  })

  // Module 1: Semanas 1-3 — Fundação
  const mod1 = await prisma.module.upsert({
    where: { id: 'mod_1' },
    update: {},
    create: {
      id: 'mod_1',
      name: 'Fundação',
      weekStart: 1,
      weekEnd: 3,
      order: 1,
      programId: program.id,
    },
  })

  // Workout A — Peito e Tríceps
  const wA = await prisma.workout.upsert({
    where: { id: 'w_a1' },
    update: {},
    create: {
      id: 'w_a1',
      name: 'Peito e Tríceps',
      dayLabel: 'Treino A',
      order: 1,
      moduleId: mod1.id,
    },
  })

  const exercisesA = [
    { name: 'Flexão de Braço', videoUrl: 'IODxDxX7oi4', sets: 3, reps: '12-15', restTime: 60, order: 1, intensity: Intensity.MEDIUM },
    { name: 'Supino Reto com Halteres', videoUrl: 'rT7DgCr-3pg', sets: 3, reps: '10-12', restTime: 90, order: 2, intensity: Intensity.HIGH },
    { name: 'Crucifixo com Halteres', videoUrl: 'eozdVDA78K0', sets: 3, reps: '12', restTime: 60, order: 3, intensity: Intensity.MEDIUM },
    { name: 'Tríceps Francês', videoUrl: 'ir5PsbniVSc', sets: 3, reps: '12', restTime: 60, order: 4, intensity: Intensity.MEDIUM },
    { name: 'Mergulho em Cadeira', videoUrl: '2z8JmcrW-As', sets: 3, reps: '10-12', restTime: 60, order: 5, intensity: Intensity.MEDIUM },
  ]

  for (const ex of exercisesA) {
    await prisma.exercise.upsert({
      where: { id: `ex_a1_${ex.order}` },
      update: {},
      create: { id: `ex_a1_${ex.order}`, ...ex, workoutId: wA.id },
    })
  }

  // Workout B — Costas e Bíceps
  const wB = await prisma.workout.upsert({
    where: { id: 'w_b1' },
    update: {},
    create: {
      id: 'w_b1',
      name: 'Costas e Bíceps',
      dayLabel: 'Treino B',
      order: 2,
      moduleId: mod1.id,
    },
  })

  const exercisesB = [
    { name: 'Remada Curvada', videoUrl: 'FWJR5Ve8bnQ', sets: 3, reps: '10-12', restTime: 90, order: 1, intensity: Intensity.HIGH },
    { name: 'Puxada Alta', videoUrl: 'eGo4IYlbE5g', sets: 3, reps: '10', restTime: 90, order: 2, intensity: Intensity.HIGH },
    { name: 'Remada Unilateral', videoUrl: 'pYcpY20QaE8', sets: 3, reps: '12', restTime: 60, order: 3, intensity: Intensity.MEDIUM },
    { name: 'Rosca Direta', videoUrl: 'ykJmrZ5v0Oo', sets: 3, reps: '12', restTime: 60, order: 4, intensity: Intensity.MEDIUM },
    { name: 'Rosca Martelo', videoUrl: 'zC3nLlEvin4', sets: 3, reps: '12', restTime: 60, order: 5, intensity: Intensity.MEDIUM },
  ]

  for (const ex of exercisesB) {
    await prisma.exercise.upsert({
      where: { id: `ex_b1_${ex.order}` },
      update: {},
      create: { id: `ex_b1_${ex.order}`, ...ex, workoutId: wB.id },
    })
  }

  // Workout C — Pernas e Glúteos
  const wC = await prisma.workout.upsert({
    where: { id: 'w_c1' },
    update: {},
    create: {
      id: 'w_c1',
      name: 'Pernas e Glúteos',
      dayLabel: 'Treino C',
      order: 3,
      moduleId: mod1.id,
    },
  })

  const exercisesC = [
    { name: 'Agachamento Livre', videoUrl: 'U3HlEF_E9fo', sets: 4, reps: '12', restTime: 90, order: 1, intensity: Intensity.HIGH },
    { name: 'Avanço com Halteres', videoUrl: 'QOVaHwm-Q6U', sets: 3, reps: '10 cada', restTime: 60, order: 2, intensity: Intensity.MEDIUM },
    { name: 'Elevação de Quadril', videoUrl: 'OSkMXyBs3w8', sets: 3, reps: '15', restTime: 60, order: 3, intensity: Intensity.MEDIUM },
    { name: 'Cadeira Extensora', videoUrl: 'YyvSfVjQeL0', sets: 3, reps: '15', restTime: 60, order: 4, intensity: Intensity.MEDIUM },
    { name: 'Panturrilha em Pé', videoUrl: 'gwLzBJYoWlI', sets: 4, reps: '20', restTime: 45, order: 5, intensity: Intensity.LOW },
  ]

  for (const ex of exercisesC) {
    await prisma.exercise.upsert({
      where: { id: `ex_c1_${ex.order}` },
      update: {},
      create: { id: `ex_c1_${ex.order}`, ...ex, workoutId: wC.id },
    })
  }

  // Module 2: Semanas 4-6 — Progressão
  const mod2 = await prisma.module.upsert({
    where: { id: 'mod_2' },
    update: {},
    create: {
      id: 'mod_2',
      name: 'Progressão',
      weekStart: 4,
      weekEnd: 6,
      order: 2,
      programId: program.id,
    },
  })

  const wD = await prisma.workout.upsert({
    where: { id: 'w_d1' },
    update: {},
    create: {
      id: 'w_d1',
      name: 'Upper Body Força',
      dayLabel: 'Treino D',
      order: 1,
      moduleId: mod2.id,
    },
  })

  const exercisesD = [
    { name: 'Desenvolvimento Militar', videoUrl: 'qEwKCR5JCog', sets: 4, reps: '8-10', restTime: 90, order: 1, intensity: Intensity.HIGH },
    { name: 'Supino Inclinado', videoUrl: 'DbFgADa2PL8', sets: 4, reps: '8-10', restTime: 90, order: 2, intensity: Intensity.HIGH },
    { name: 'Pullover', videoUrl: '9YrGDmFYxTk', sets: 3, reps: '12', restTime: 60, order: 3, intensity: Intensity.MEDIUM },
    { name: 'Elevação Lateral', videoUrl: '3VcKaXpzqRo', sets: 3, reps: '15', restTime: 45, order: 4, intensity: Intensity.LOW },
    { name: 'Encolhimento de Ombros', videoUrl: 'cJRVVxmytaM', sets: 3, reps: '15', restTime: 45, order: 5, intensity: Intensity.LOW },
  ]

  for (const ex of exercisesD) {
    await prisma.exercise.upsert({
      where: { id: `ex_d1_${ex.order}` },
      update: {},
      create: { id: `ex_d1_${ex.order}`, ...ex, workoutId: wD.id },
    })
  }

  // Module 3 & 4 (structure only)
  await prisma.module.upsert({
    where: { id: 'mod_3' },
    update: {},
    create: { id: 'mod_3', name: 'Intensidade', weekStart: 7, weekEnd: 9, order: 3, programId: program.id },
  })

  await prisma.module.upsert({
    where: { id: 'mod_4' },
    update: {},
    create: { id: 'mod_4', name: 'Definição', weekStart: 10, weekEnd: 12, order: 4, programId: program.id },
  })

  console.log('✅ Seed concluído! Admin: admin@fitpro.com / admin123 | Demo: demo@fitpro.com / user123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
