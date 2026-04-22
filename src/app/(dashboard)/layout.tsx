'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/dashboard', label: 'Início', icon: '🏠' },
  { href: '/treinos', label: 'Treinos', icon: '🏋️' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/perfil', label: 'Perfil', icon: '👤' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* SIDEBAR — desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-zinc-900 border-r border-zinc-800 fixed h-full">
        <div className="px-5 py-5 border-b border-zinc-800">
          <span className="text-xl font-black">FIT<span className="text-red-600">PRO</span></span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
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

          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-4 ${
                pathname.startsWith('/admin') ? 'bg-red-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <span>⚙️</span> Admin
            </Link>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-600 mb-1 truncate">{session?.user?.email}</div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-zinc-500 hover:text-red-500 transition-colors"
          >
            Sair →
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        {children}
      </main>

      {/* BOTTOM NAV — mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-zinc-900 border-t border-zinc-800 z-50">
        <div className="flex">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
                  active ? 'text-red-500' : 'text-zinc-600'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
