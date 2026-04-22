import Link from 'next/link'

const benefits = [
  { icon: '🎬', title: '48 Treinos com Vídeo HD', desc: 'Cada exercício tem demonstração em vídeo para execução perfeita.' },
  { icon: '⏱️', title: 'Timer Automático', desc: 'Descanso cronometrado entre séries. Nunca mais perder tempo.' },
  { icon: '📊', title: 'Progresso em Tempo Real', desc: 'Acompanhe calorias, séries e evolução semana a semana.' },
  { icon: '📅', title: 'Calendário de Treinos', desc: 'Streak diário e histórico completo de atividades.' },
  { icon: '🔥', title: 'Cálculo de Calorias', desc: 'Estimativa de calorias queimadas ao fim de cada treino.' },
  { icon: '♾️', title: 'Acesso Vitalício', desc: 'Pague uma vez. Acesse para sempre. Sem mensalidade.' },
]

const testimonials = [
  {
    name: 'Marcos Souza',
    location: 'São Paulo, SP',
    result: 'Perdi 14kg em 11 semanas',
    text: 'O timer automático mudou tudo. Antes ficava perdendo 5 minutos entre séries. Agora sigo o descanso exato e os resultados vieram muito mais rápido.',
    avatar: 'MS',
  },
  {
    name: 'Ana Paula Lima',
    location: 'Rio de Janeiro, RJ',
    result: 'Ganhei definição muscular visível',
    text: 'Nunca tinha conseguido seguir um programa por mais de 2 semanas. Com os vídeos de cada exercício e o controle de séries, é impossível errar. Finalizei as 12 semanas.',
    avatar: 'AL',
  },
  {
    name: 'Rafael Mendes',
    location: 'Belo Horizonte, MG',
    result: '+8kg de massa em 12 semanas',
    text: 'A progressão de carga semana a semana é milimétrica. O programa realmente pensa no longo prazo. Melhor investimento que fiz na vida.',
    avatar: 'RM',
  },
]

const steps = [
  { num: '01', title: 'Compre e crie sua conta', desc: 'Pagamento seguro via Stripe. Acesso liberado instantaneamente após a confirmação.' },
  { num: '02', title: 'Siga o plano de 12 semanas', desc: '4 módulos progressivos. Treinos de 45-60 min. Vídeos para cada exercício.' },
  { num: '03', title: 'Veja a transformação', desc: 'Acompanhe seu progresso diário. Streak, calorias e evolução completa no painel.' },
]

const faqs = [
  {
    q: 'Preciso de equipamentos?',
    a: 'Os treinos de Fundação (semanas 1-3) são majoritariamente com peso corporal. Os módulos avançados incluem exercícios opcionais com halteres que intensificam os resultados.',
  },
  {
    q: 'Por quanto tempo tenho acesso?',
    a: 'Acesso vitalício. Você paga uma única vez e acessa para sempre, incluindo todas as atualizações futuras do programa.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Garantia incondicional de 7 dias. Se não ficar satisfeito por qualquer motivo, devolvemos 100% do valor investido. Sem perguntas.',
  },
  {
    q: 'Posso usar no celular?',
    a: 'Sim. O app é 100% mobile-first. Desenvolvido para funcionar perfeitamente no celular durante o treino na academia ou em casa.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight">
            FIT<span className="text-red-600">PRO</span>
          </span>
          <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
            Entrar →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">+1.200 pessoas transformadas</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            QUEIME.
            <br />
            <span className="text-gradient">CONSTRUA.</span>
            <br />
            DOMINE.
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            O programa de treino definitivo para transformar seu corpo em{' '}
            <span className="text-white font-semibold">12 semanas</span> — com vídeos HD, timer automático de descanso
            e acompanhamento completo de progresso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/api/stripe/checkout"
              className="btn-primary text-lg px-10 py-4 rounded-xl glow-red inline-flex items-center justify-center gap-2 text-center"
            >
              🔥 COMEÇAR AGORA — R$ 97
            </a>
            <Link
              href="/login"
              className="btn-secondary text-base px-8 py-4 rounded-xl inline-flex items-center justify-center"
            >
              Já tenho conta
            </Link>
          </div>

          <p className="text-zinc-600 text-sm">
            ✓ Pagamento seguro via Stripe &nbsp;·&nbsp; ✓ Acesso imediato &nbsp;·&nbsp; ✓ Garantia de 7 dias
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Tudo que você precisa para <span className="text-gradient">transformar seu corpo</span>
            </h2>
            <p className="text-zinc-500">Em uma única plataforma, acessível de qualquer dispositivo.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6 hover:border-zinc-700 transition-colors">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-white mb-1">{b.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">Como funciona</h2>
            <p className="text-zinc-500">Simples, direto, sem enrolação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-6xl font-black text-red-600/20 mb-3">{s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              12 semanas. <span className="text-gradient">4 fases.</span> 1 transformação.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { week: 'Semanas 1–3', name: 'Fundação', desc: 'Adaptação muscular e aprendizado dos movimentos. Base sólida para o que vem a seguir.', color: 'border-zinc-700' },
              { week: 'Semanas 4–6', name: 'Progressão', desc: 'Aumento progressivo de carga e volume. Seu corpo começa a se transformar de forma visível.', color: 'border-blue-800/50' },
              { week: 'Semanas 7–9', name: 'Intensidade', desc: 'Treinos de alta intensidade. Queima máxima de gordura. Ganho acelerado de massa.', color: 'border-orange-800/50' },
              { week: 'Semanas 10–12', name: 'Definição', desc: 'Fase final de definição muscular. Seu melhor físico. Resultado máximo.', color: 'border-red-800/50' },
            ].map((phase) => (
              <div key={phase.name} className={`card p-6 border ${phase.color}`}>
                <div className="text-xs text-zinc-500 font-semibold mb-1">{phase.week}</div>
                <h3 className="text-xl font-black text-white mb-2">{phase.name}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Resultados reais de <span className="text-gradient">pessoas reais</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center text-sm font-bold text-red-400">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-zinc-600 text-xs">{t.location}</div>
                  </div>
                </div>
                <div className="badge-red mb-3 inline-block">{t.result}</div>
                <p className="text-zinc-400 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex gap-0.5 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-4" id="comprar">
        <div className="max-w-lg mx-auto">
          <div className="card p-8 text-center border-red-600/30 border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent" />
            <div className="relative">
              <div className="badge-red mb-4 inline-block">OFERTA MAIS POPULAR</div>
              <h2 className="text-3xl font-black mb-2">Acesso Completo</h2>
              <p className="text-zinc-500 mb-6 text-sm">12 semanas · 48 treinos · Acesso vitalício</p>

              <div className="mb-2">
                <span className="text-zinc-600 line-through text-lg">R$ 297</span>
              </div>
              <div className="text-6xl font-black text-white mb-1">
                R$ <span className="text-red-500">97</span>
              </div>
              <p className="text-zinc-600 text-sm mb-8">pagamento único • sem mensalidade</p>

              <ul className="text-sm text-zinc-400 space-y-2 mb-8 text-left">
                {['48 treinos estruturados', 'Vídeos HD para cada exercício', 'Timer automático de descanso', 'Cálculo de calorias', 'Calendário e histórico', 'Acesso vitalício'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {item}
                  </li>
                ))}
              </ul>

              <a
                href="/api/stripe/checkout"
                className="btn-primary w-full text-lg py-4 rounded-xl glow-red flex items-center justify-center gap-2"
              >
                🔥 QUERO TRANSFORMAR MEU CORPO
              </a>
              <p className="text-zinc-600 text-xs mt-4">🔒 Pagamento 100% seguro · Garantia de 7 dias</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Perguntas frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="card p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 px-4 bg-zinc-900/30 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Chega de adiar. <span className="text-gradient">Comece hoje.</span>
          </h2>
          <p className="text-zinc-500 mb-8">Cada semana que passa sem um plano é uma semana de resultado perdido.</p>
          <a href="/api/stripe/checkout" className="btn-primary text-lg px-10 py-4 rounded-xl glow-red inline-block">
            🔥 COMEÇAR AGORA — R$ 97
          </a>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-zinc-900 text-center text-zinc-700 text-sm">
        © 2024 FitPro. Todos os direitos reservados.
      </footer>
    </div>
  )
}
