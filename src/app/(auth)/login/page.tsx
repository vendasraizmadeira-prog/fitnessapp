'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou senha inválidos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-black mb-1">Entrar</h1>
      <p className="text-zinc-500 text-sm mb-6">Acesse seu painel de treinos</p>

      {params.get('registered') && (
        <div className="bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-4">
          Conta criada! Faça login para continuar.
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
          <input
            type="email"
            className="input-field"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Senha</label>
          <input
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Não tem conta?{' '}
        <Link href="/register" className="text-red-500 hover:text-red-400 font-medium">
          Criar conta
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card p-8 animate-pulse"><div className="h-8 bg-zinc-800 rounded w-1/2 mb-4" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
