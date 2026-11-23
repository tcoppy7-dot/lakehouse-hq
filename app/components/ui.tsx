import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

/* ---------- Wordmark ---------- */
export function Wordmark({ href = '/', height = 24, className = '' }: { href?: string; height?: number; className?: string }) {
  // logo-wordmark-dark.png is the lettering from the Lakehouse HQ logo, recolored for light backgrounds.
  return (
    <Link href={href} className={`inline-flex shrink-0 ${className}`} aria-label="Lakehouse HQ home">
      <Image src="/logo-wordmark-dark.png" alt="Lakehouse HQ" width={Math.round(height * 5.97)} height={height} priority style={{ height, width: 'auto' }} />
    </Link>
  )
}

export function FullLogo({ width = 200, className = '' }: { width?: number; className?: string }) {
  return (
    <Image src="/logo-dark.png" alt="Lakehouse HQ" width={width} height={Math.round(width * 0.74)} className={className} style={{ width, height: 'auto' }} />
  )
}

/* ---------- Buttons ---------- */
type Variant = 'primary' | 'secondary' | 'quiet' | 'danger'
type Size = 'md' | 'lg' | 'sm'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-lake text-white hover:bg-lake-dark',
  secondary: 'bg-surface text-ink border border-line hover:border-ink-3',
  quiet: 'text-ink-2 hover:text-ink hover:bg-sunk',
  danger: 'text-danger hover:bg-danger/8',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[14px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-[16px]',
}

export function btn(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`
}

/* ---------- Form fields ---------- */
export const inputClass =
  'w-full h-12 rounded-xl border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-lake focus:ring-3 focus:ring-lake/15'
export const textareaClass =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-lake focus:ring-3 focus:ring-lake/15 resize-y'

export function Field({
  label,
  htmlFor,
  hint,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[14px] font-medium text-ink mb-2">
        {label}
        {optional && <span className="font-normal text-ink-3"> (optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-2 text-[13px] text-ink-3">{hint}</p>}
    </div>
  )
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl bg-danger/8 px-4 py-3 text-[14px] text-danger">
      {message}
    </p>
  )
}

/* ---------- Status ---------- */
const STATUS: Record<string, { label: string; className: string }> = {
  requested: { label: 'Requested', className: 'bg-sunk text-ink-2' },
  confirmed: { label: 'Confirmed', className: 'bg-lake-tint text-lake-dark' },
  in_progress: { label: 'In progress', className: 'bg-lake text-white' },
  completed: { label: 'Done', className: 'bg-ink text-white' },
}

export function statusLabel(status: string) {
  return STATUS[status]?.label ?? status
}

export function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, className: 'bg-sunk text-ink-2' }
  return (
    <span className={`inline-flex items-center h-6 px-2.5 rounded-full text-[12.5px] font-medium whitespace-nowrap ${s.className}`}>
      {s.label}
    </span>
  )
}

/* ---------- Layout pieces ---------- */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
      <div>
        <h1 className="text-[30px] sm:text-[34px] font-semibold tracking-[-0.02em] leading-[1.1]">{title}</h1>
        {description && <p className="mt-2 text-[16px] text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-3">
      <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{children}</h2>
      {action}
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <p className="text-[17px] font-semibold">{title}</p>
      <p className="mt-2 text-[15px] text-ink-2 max-w-sm mx-auto">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex-1 min-h-[60vh] grid place-items-center" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-ink-3 text-[15px]">
        <span className="h-4 w-4 rounded-full border-2 border-line border-t-lake animate-spin" />
        {label}
      </div>
    </div>
  )
}
