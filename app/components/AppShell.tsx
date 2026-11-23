'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { Wordmark, btn } from './ui'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: 'home' },
  { href: '/tasks', label: 'Requests', icon: 'list' },
  { href: '/property', label: 'House', icon: 'key' },
  { href: '/inventory', label: 'Inventory', icon: 'box' },
  { href: '/packing', label: 'Packing', icon: 'bag' },
] as const

function Icon({ name }: { name: (typeof NAV)[number]['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden>
      {name === 'home' && <path {...common} d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />}
      {name === 'list' && (
        <g {...common}>
          <rect x="4" y="4" width="16" height="17" rx="2.5" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </g>
      )}
      {name === 'key' && (
        <g {...common}>
          <circle cx="8.5" cy="15.5" r="4" />
          <path d="m11.5 12.5 8-8M16 8l2.5 2.5M14 10l2 2" />
        </g>
      )}
      {name === 'box' && (
        <g {...common}>
          <path d="M3.5 8 12 4l8.5 4v8.5L12 20.5 3.5 16.5z" />
          <path d="M3.5 8 12 12l8.5-4M12 12v8.5" />
        </g>
      )}
      {name === 'bag' && (
        <g {...common}>
          <rect x="4" y="7.5" width="16" height="13" rx="2.5" />
          <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
        </g>
      )}
    </svg>
  )
}

export default function AppShell({ children, wide = false, focused = false }: { children: ReactNode; wide?: boolean; focused?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (!cancelled && data?.role === 'admin') setIsAdmin(true)
    }
    check()
    return () => { cancelled = true }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex-1 flex flex-col min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-5xl'} h-16 px-5 sm:px-8 flex items-center gap-8`}>
          <Wordmark href="/dashboard" />
          <nav aria-label="Main" className="hidden md:flex items-center gap-1 text-[15px]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`h-9 px-3 rounded-full inline-flex items-center transition-colors ${
                  isActive(item.href) ? 'bg-sunk text-ink font-medium' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/operator"
                aria-current={isActive('/operator') ? 'page' : undefined}
                className={`h-9 px-3 rounded-full inline-flex items-center transition-colors ${
                  isActive('/operator') ? 'bg-sunk text-ink font-medium' : 'text-ink-2 hover:text-ink'
                }`}
              >
                Operator
              </Link>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {isAdmin && (
              <Link href="/operator" className="md:hidden text-[14px] text-ink-2 px-2 h-9 inline-flex items-center">
                Operator
              </Link>
            )}
            {!['/dashboard', '/tasks'].includes(pathname) && (
            <Link
              href="/tasks?new=1"
              onClick={(e) => {
                // Already on Requests: open the new request flow in place.
                if (pathname === '/tasks') {
                  e.preventDefault()
                  window.dispatchEvent(new Event('lakehouse:new-request'))
                }
              }}
              className={btn('primary', 'sm', 'max-md:!hidden')}
            >
              New request
            </Link>
            )}
            <button onClick={signOut} className={btn('quiet', 'sm')}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full mx-auto ${wide ? 'max-w-6xl' : 'max-w-5xl'} px-5 sm:px-8 pt-8 sm:pt-12 ${focused ? 'pb-12' : 'pb-32'} md:pb-20`}>
        {children}
      </main>

      {/* Phone tab bar, hidden while a step by step flow is open */}
      {!focused && (
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11.5px] ${active ? 'text-lake font-medium' : 'text-ink-3'}`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      )}
    </div>
  )
}
