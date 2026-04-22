'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/treinos', label: 'Treinos', icon: '🏋️' },
  { href: '/admin/usuarios', label: 'Usuários', icon: '👥' },
  { href: '/dashboard', label: '← App', icon: '🏠' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') return null

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 fixed h-full">
        <div className="px-5 py-5 border-b border-zinc-800">
          <span className="text-sm font-black">FIT<span className="text-red-600">PRO</span></span>
          <div className="text-xs text-zinc-600 mt-0.5">Painel Admin</div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {adminLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 ml-56">{children}</main>
    </div>
  )
}
