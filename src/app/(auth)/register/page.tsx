'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erro ao criar conta.')
      setLoading(false)
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-black mb-1">Criar conta</h1>
      <p className="text-zinc-500 text-sm mb-6">Já tem um código de acesso? Cadastre-se aqui.</p>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome</label>
          <input
            className="input-field"
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Senha</label>
          <input
            type="password"
            className="input-field"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Já tem conta?{' '}
        <Link href="/login" className="text-red-500 hover:text-red-400 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
