import Link from 'next/link'
import type { ReactNode } from 'react'
import { FullLogo } from './ui'

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col min-h-dvh">
      <main className="flex-1 flex items-start sm:items-center justify-center px-5 pt-10 pb-16">
        <div className="w-full max-w-[400px]">
          <Link href="/" aria-label="Lakehouse HQ home" className="inline-block mb-10">
            <FullLogo width={180} />
          </Link>
          <h1 className="text-[30px] font-semibold tracking-[-0.02em] leading-tight">{title}</h1>
          <p className="mt-2 text-[16px] text-ink-2">{description}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-[15px] text-ink-2">{footer}</p>
        </div>
      </main>
      <footer className="px-5 sm:px-8 py-6 text-[13px] text-ink-3">
        <Link href="/" className="hover:text-ink-2">
          About Lakehouse HQ
        </Link>
      </footer>
    </div>
  )
}
