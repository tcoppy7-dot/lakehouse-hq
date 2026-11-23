// Dates are stored as 'YYYY-MM-DD'. Parse them as local dates so they never shift a day.
export function parseDate(value?: string | null): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function todayKey(): string {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

export function formatDate(value?: string | null, opts: { weekday?: boolean; year?: boolean } = {}): string {
  const d = parseDate(value)
  if (!d) return 'No date set'
  const showYear = opts.year ?? d.getFullYear() !== new Date().getFullYear()
  return d.toLocaleDateString('en-US', {
    weekday: opts.weekday === false ? undefined : 'long',
    month: 'long',
    day: 'numeric',
    year: showYear ? 'numeric' : undefined,
  })
}

export function formatShortDate(value?: string | null): string {
  const d = parseDate(value)
  if (!d) return 'No date'
  const showYear = d.getFullYear() !== new Date().getFullYear()
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: showYear ? 'numeric' : undefined })
}

export function formatTime(time?: string | null): string {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${minutes} ${ampm}`
}

export function formatWhen(date?: string | null, time?: string | null): string {
  const t = formatTime(time)
  return t ? `${formatDate(date)} at ${t}` : formatDate(date)
}

export function formatPrice(price?: number | null): string {
  return price && price > 0 ? `$${price}` : 'Quote'
}

export type TaskLike = { scheduled_date?: string | null; status: string }

export function isUpcoming(task: TaskLike): boolean {
  return task.status !== 'completed' && !!task.scheduled_date && task.scheduled_date >= todayKey()
}

export function firstName(user: { email?: string; user_metadata?: { full_name?: string } } | null): string {
  const full = user?.user_metadata?.full_name?.trim()
  if (full) return full.split(/\s+/)[0]
  return ''
}
