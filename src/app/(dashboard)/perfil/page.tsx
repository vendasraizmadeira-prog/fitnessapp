'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { GOAL_LABELS, type Goal } from '@/types'

interface Profile {
  name: string
  email: string
  weight: number | null
  height: number | null
  goal: Goal | null
  createdAt: string
}

export default function PerfilPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({ name: '', weight: '', height: '', goal: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((d) => {
        setProfile(d)
        setForm({
          name: d.name ?? '',
          weight: d.weight?.toString() ?? '',
          height: d.height?.toString() ?? '',
          goal: d.goal ?? '',
        })
      })
  }, [])

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
        goal: form.goal || null,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const bmi = form.weight && form.height
    ? (parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
    : null

  const memberDays = profile
    ? Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000)
    : 0

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Perfil</h1>
        <p className="text-zinc-500 text-sm mt-1">Gerencie seus dados e objetivos</p>
      </div>

      {/* Avatar + member info */}
      <div className="card p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center text-xl font-black text-red-400">
          {form.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div>
          <div className="font-bold text-lg">{form.name || 'Atleta'}</div>
          <div className="text-zinc-600 text-sm">{session?.user?.email}</div>
          <div className="text-xs text-zinc-700 mt-0.5">Membro há {memberDays} dias</div>
        </div>
      </div>

      {/* BMI card */}
      {bmi && (
        <div className="card p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-zinc-500">Índice de Massa Corporal</div>
            <div className="text-2xl font-black">{bmi}</div>
          </div>
          <span className={`badge-zinc ${
            parseFloat(bmi) < 18.5 ? 'text-blue-400' :
            parseFloat(bmi) < 25 ? 'text-emerald-400' :
            parseFloat(bmi) < 30 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {parseFloat(bmi) < 18.5 ? 'Abaixo do peso' :
             parseFloat(bmi) < 25 ? 'Peso normal' :
             parseFloat(bmi) < 30 ? 'Sobrepeso' : 'Obesidade'}
          </span>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-4">
          ✓ Perfil atualizado com sucesso!
        </div>
      )}

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome</label>
          <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Seu nome" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Peso (kg)</label>
            <input
              type="number"
              className="input-field"
              value={form.weight}
              onChange={(e) => update('weight', e.target.value)}
              placeholder="80"
              step="0.1"
              min="30"
              max="300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Altura (cm)</label>
            <input
              type="number"
              className="input-field"
              value={form.height}
              onChange={(e) => update('height', e.target.value)}
              placeholder="175"
              min="100"
              max="250"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Objetivo</label>
          <select className="input-field" value={form.goal} onChange={(e) => update('goal', e.target.value)}>
            <option value="">Selecionar objetivo</option>
            {(Object.entries(GOAL_LABELS) as [Goal, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}
