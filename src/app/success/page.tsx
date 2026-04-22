import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-black mb-3">Pagamento Confirmado!</h1>
        <p className="text-zinc-400 mb-2">
          Seu acesso ao <span className="text-white font-semibold">FitPro 12 Semanas</span> foi liberado.
        </p>
        <p className="text-zinc-600 text-sm mb-8">
          Uma confirmação foi enviada para o seu email.
        </p>

        <div className="card p-6 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">✓</span>
            <span className="text-sm text-zinc-300">48 treinos estruturados desbloqueados</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">✓</span>
            <span className="text-sm text-zinc-300">Timer automático ativado</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-500">✓</span>
            <span className="text-sm text-zinc-300">Acesso vitalício garantido</span>
          </div>
        </div>

        <Link href="/dashboard" className="btn-primary w-full text-lg py-4 inline-block text-center">
          🚀 Ir para o Painel de Treinos
        </Link>
      </div>
    </div>
  )
}
