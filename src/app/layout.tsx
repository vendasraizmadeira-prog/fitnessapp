import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'FitPro — Transforme Seu Corpo em 12 Semanas',
  description: 'O programa de treino mais completo para transformar seu físico. 48 treinos estruturados com vídeos, timer automático e acompanhamento de progresso.',
  keywords: 'treino, fitness, programa de treino, emagrecer, ganhar massa muscular',
  openGraph: {
    title: 'FitPro — Transforme Seu Corpo em 12 Semanas',
    description: 'O programa de treino definitivo para transformar seu físico.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
