'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell from '../components/AppShell'
import TaskCalendar from '../components/TaskCalendar'
import { Card, EmptyState, Field, FormError, LoadingScreen, PageHeader, StatusChip, btn, inputClass, textareaClass } from '../components/ui'
import { formatDate, formatPrice, formatShortDate, formatTime, formatWhen, isUpcoming, todayKey } from '../lib/format'

type Service = { title: string; price: number; image: string; description: string; hasToggle: boolean }

const TASK_MENU: Service[] = [
  { title: 'Boat Cover', price: 20, image: '/marina.jpg', description: 'Put on or take off your boat cover', hasToggle: true },
  { title: 'Jet Ski Cover', price: 10, image: '/jetskisondock.jpeg', description: 'Cover on or off for each jet ski', hasToggle: true },
  { title: 'Patio Furniture', price: 35, image: '/patiochairs.jpeg', description: 'Set up or store patio chairs and cushions', hasToggle: true },
  { title: 'Boat Fuel Top-Off', price: 0, image: '/gas.jpeg', description: 'Charged at the actual cost of fuel', hasToggle: false },
  { title: 'Seasonal Open', price: 0, image: '/property.jpg', description: 'Full spring opening package. We will send a quote.', hasToggle: false },
  { title: 'Seasonal Close', price: 0, image: '/vikinghouse.JPG', description: 'Full fall closing package. We will send a quote.', hasToggle: false },
  { title: 'Lawn Mowing', price: 0, image: '/lawnmowing.jpg', description: 'Lawn mowed and clippings cleared. Can repeat on a schedule.', hasToggle: false },
  { title: 'General Maintenance', price: 0, image: '/boats.jpg', description: 'Describe what you need and we will send a quote.', hasToggle: false },
]

const priceLabel = (s: Service) => (s.title === 'Boat Fuel Top-Off' ? 'Cost of fuel' : s.price > 0 ? `$${s.price}` : 'Quote')

type Step = 'list' | 'menu' | 'details' | 'review' | 'submitted'
const STEP_NUMBER: Partial<Record<Step, number>> = { menu: 1, details: 2, review: 3 }
const STEP_NAME: Partial<Record<Step, string>> = { menu: 'Choose a service', details: 'Pick a time', review: 'Review and send' }

export default function Tasks() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<Step>('list')
  const [selected, setSelected] = useState<Service | null>(null)
  const [toggleOption, setToggleOption] = useState<'On' | 'Off'>('On')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [intervalDays, setIntervalDays] = useState(14)
  const [endDate, setEndDate] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await loadTasks(user.id)
      if (new URLSearchParams(window.location.search).get('new') === '1') setStep('menu')
      setLoading(false)
    }
    init()
  }, [router])

  // Scroll to top whenever the step changes, so each step starts at its heading.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  const loadTasks = async (uid: string) => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('owner_id', uid)
      .order('scheduled_date', { ascending: true })
    setTasks(data || [])
  }

  const getTaskTitle = () => {
    if (selected?.hasToggle) return `${selected.title} ${toggleOption}`
    return selected?.title ?? ''
  }

  const generateRecurringTasks = async (userId: string) => {
    const [sy, sm, sd] = date.split('-').map(Number)
    const [ey, em, ed] = endDate.split('-').map(Number)
    const current = new Date(sy, sm - 1, sd)
    const end = new Date(ey, em - 1, ed)
    const taskRows = []
    while (current <= end) {
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
      taskRows.push({
        owner_id: userId,
        title: getTaskTitle(),
        description: notes,
        scheduled_date: key,
        scheduled_time: time || null,
        status: 'requested',
        price: selected!.price,
      })
      current.setDate(current.getDate() + intervalDays)
    }
    const { error: insertError } = await supabase.from('tasks').insert(taskRows)
    if (insertError) throw insertError
    await supabase.from('recurring_tasks').insert({
      owner_id: userId,
      title: getTaskTitle(),
      description: notes,
      interval_days: intervalDays,
      start_date: date,
      end_date: endDate,
      scheduled_time: time || null,
      price: selected!.price,
      status: 'active',
    })
  }

  const handleSubmit = async () => {
    if (!selected || !user) return
    setSubmitting(true)
    setError(null)
    try {
      if (isRecurring && endDate) {
        await generateRecurringTasks(user.id)
      } else {
        const { error: insertError } = await supabase.from('tasks').insert({
          owner_id: user.id,
          title: getTaskTitle(),
          description: notes,
          scheduled_date: date,
          scheduled_time: time || null,
          status: 'requested',
          price: selected.price,
        })
        if (insertError) throw insertError
      }
    } catch {
      setError('Your request did not go through. Check your connection and try sending it again.')
      setSubmitting(false)
      return
    }

    // The request is saved. A failed confirmation email should not block the owner.
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: user.email,
          taskTitle: getTaskTitle() + (isRecurring ? ' (Recurring)' : ''),
          scheduledDate: date,
          scheduledTime: time ? formatTime(time) : 'No time specified',
          price: selected.price,
          notes,
        }),
      })
    } catch {}

    await loadTasks(user.id)
    setSubmitting(false)
    setStep('submitted')
  }

  const resetFlow = (to: Step = 'list') => {
    setStep(to)
    setSelected(null)
    setToggleOption('On')
    setDate('')
    setTime('')
    setNotes('')
    setIsRecurring(false)
    setIntervalDays(14)
    setEndDate('')
    setError(null)
    if (to === 'list') window.history.replaceState(null, '', '/tasks')
  }

  // The "New request" button in the top bar opens the flow in place when already on this page.
  useEffect(() => {
    const open = () => resetFlow('menu')
    window.addEventListener('lakehouse:new-request', open)
    return () => window.removeEventListener('lakehouse:new-request', open)
  })

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    )
  }

  const upcoming = tasks.filter(isUpcoming)
  const past = tasks.filter((t) => !isUpcoming(t)).reverse()
  const canContinue = !!date && (!isRecurring || !!endDate)
  const stepNumber = STEP_NUMBER[step]

  return (
    <AppShell>
      {stepNumber && (
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => (step === 'menu' ? resetFlow('list') : setStep(step === 'review' ? 'details' : 'menu'))}
            className="text-[15px] font-medium text-ink-2 hover:text-ink"
          >
            ‹ {step === 'menu' ? 'Cancel' : 'Back'}
          </button>
          <p className="text-[14px] text-ink-3" aria-live="polite">
            Step {stepNumber} of 3, {STEP_NAME[step]?.toLowerCase()}
          </p>
        </div>
      )}

      {/* ---------- Requests list ---------- */}
      {step === 'list' && (
        <>
          <PageHeader
            title="Requests"
            description="Everything you have asked us to take care of."
            action={
              <button onClick={() => setStep('menu')} className={btn('primary', 'md', 'w-full sm:w-auto')}>
                New request
              </button>
            }
          />

          {tasks.length === 0 ? (
            <EmptyState
              title="No requests yet"
              body="Pick a service, choose a date, and we will confirm within 24 hours."
              action={
                <button onClick={() => setStep('menu')} className={btn('primary', 'md')}>
                  Request a service
                </button>
              }
            />
          ) : (
            <>
              <div className="mb-6 inline-flex rounded-full bg-sunk p-1" role="tablist" aria-label="View">
                {(['list', 'calendar'] as const).map((v) => (
                  <button
                    key={v}
                    role="tab"
                    aria-selected={view === v}
                    onClick={() => setView(v)}
                    className={`h-8 px-4 rounded-full text-[14px] font-medium transition-colors ${view === v ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(27,31,36,0.08)]' : 'text-ink-2'}`}
                  >
                    {v === 'list' ? 'List' : 'Calendar'}
                  </button>
                ))}
              </div>

              {view === 'calendar' && <TaskCalendar tasks={tasks} />}

              {view === 'list' && (
                <div className="space-y-10">
                  <section>
                    <h2 className="text-[17px] font-semibold mb-3">Upcoming</h2>
                    {upcoming.length === 0 ? (
                      <p className="text-[15px] text-ink-2">
                        Nothing scheduled.{' '}
                        <button onClick={() => setStep('menu')} className="font-medium text-lake hover:text-lake-dark">
                          Request a service
                        </button>
                      </p>
                    ) : (
                      <TaskList tasks={upcoming} />
                    )}
                  </section>
                  {past.length > 0 && (
                    <section>
                      <h2 className="text-[17px] font-semibold mb-3">Past</h2>
                      <TaskList tasks={past} past />
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ---------- Step 1: choose ---------- */}
      {step === 'menu' && (
        <>
          <PageHeader title="What do you need done?" description="Prices are per visit. Quoted services get a price from us before any work starts." />
          <ul className="grid gap-3 sm:grid-cols-2">
            {TASK_MENU.map((task) => (
              <li key={task.title}>
                <button
                  type="button"
                  onClick={() => { setSelected(task); setToggleOption('On'); setIsRecurring(false); setStep('details') }}
                  className="w-full flex items-center gap-4 rounded-2xl border border-line bg-surface p-3 pr-5 text-left transition-colors hover:border-ink-3"
                >
                  <span className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl bg-sunk">
                    <Image src={task.image} alt="" fill sizes="72px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[16px] font-semibold">{task.title}</span>
                    <span className="block text-[14px] text-ink-2 mt-0.5">{task.description}</span>
                  </span>
                  <span className={`text-[15px] whitespace-nowrap ${task.price > 0 ? 'font-semibold' : 'text-ink-2'}`}>{priceLabel(task)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ---------- Step 2: details ---------- */}
      {step === 'details' && selected && (
        <div className="max-w-xl">
          <PageHeader title="When should we come?" />
          <Card className="flex items-center gap-4 p-3 pr-5 mb-8">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-sunk">
              <Image src={selected.image} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">{selected.title}</span>
              <span className="block text-[14px] text-ink-2">{priceLabel(selected)}</span>
            </span>
            <button type="button" onClick={() => setStep('menu')} className="text-[14px] font-medium text-lake hover:text-lake-dark">
              Change
            </button>
          </Card>

          <div className="space-y-6">
            {selected.hasToggle && (
              <fieldset>
                <legend className="block text-[14px] font-medium mb-2">Cover on or off?</legend>
                <div className="grid grid-cols-2 gap-2 rounded-full bg-sunk p-1">
                  {(['On', 'Off'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={toggleOption === opt}
                      onClick={() => setToggleOption(opt)}
                      className={`h-10 rounded-full text-[15px] font-medium transition-colors ${toggleOption === opt ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(27,31,36,0.08)]' : 'text-ink-2'}`}
                    >
                      {selected.title === 'Patio Furniture' ? (opt === 'On' ? 'Set up' : 'Store') : opt === 'On' ? 'Put on' : 'Take off'}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={isRecurring ? 'First visit' : 'Date'} htmlFor="date">
                <input id="date" type="date" min={todayKey()} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Time" htmlFor="time" optional>
                <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
              </Field>
            </div>

            {selected.title === 'Lawn Mowing' && (
              <div className="rounded-2xl border border-line bg-surface">
                <label htmlFor="recurring" className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer">
                  <span>
                    <span className="block text-[15px] font-medium">Repeat on a schedule</span>
                    <span className="block text-[14px] text-ink-2">We will add a visit for each date.</span>
                  </span>
                  <input
                    id="recurring"
                    type="checkbox"
                    role="switch"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="peer sr-only"
                  />
                  <span aria-hidden className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-lake peer-focus-visible:outline-2 peer-focus-visible:outline-lake peer-focus-visible:outline-offset-2 after:absolute after:top-0.5 after:left-0.5 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                </label>
                {isRecurring && (
                  <div className="grid gap-6 sm:grid-cols-2 border-t border-line px-5 py-5">
                    <Field label="Mow every" htmlFor="interval">
                      <select id="interval" value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))} className={inputClass}>
                        <option value={7}>Week</option>
                        <option value={14}>2 weeks</option>
                        <option value={21}>3 weeks</option>
                      </select>
                    </Field>
                    <Field label="Last visit by" htmlFor="end">
                      <input id="end" type="date" min={date || todayKey()} value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                )}
              </div>
            )}

            <Field label="Notes for our team" htmlFor="notes" optional>
              <textarea
                id="notes"
                rows={3}
                placeholder="Gate code, where the cover is stored, anything we should know"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={textareaClass}
              />
            </Field>

            <div className="pt-2">
              <button type="button" onClick={() => canContinue && setStep('review')} disabled={!canContinue} className={btn('primary', 'lg', 'w-full sm:w-auto')}>
                Review request
              </button>
              {!canContinue && (
                <p className="mt-3 text-[14px] text-ink-3">
                  {!date ? 'Choose a date to continue.' : 'Choose the last visit date to continue.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Step 3: review ---------- */}
      {step === 'review' && selected && (
        <div className="max-w-xl">
          <PageHeader title="Review your request" description="We will confirm within 24 hours and email you at each step." />
          <Card>
            <dl className="divide-y divide-line text-[15px]">
              <Row label="Service" value={getTaskTitle() + (isRecurring ? ', repeating' : '')} />
              <Row label={isRecurring ? 'First visit' : 'Date'} value={formatDate(date)} />
              {isRecurring && <Row label="Repeats" value={`Every ${intervalDays / 7 === 1 ? 'week' : `${intervalDays / 7} weeks`}`} />}
              {isRecurring && <Row label="Last visit by" value={formatDate(endDate)} />}
              <Row label="Time" value={time ? formatTime(time) : 'Any time'} />
              <Row label="Price" value={priceLabel(selected)} strong />
              {notes && <Row label="Notes" value={notes} />}
            </dl>
          </Card>
          <div className="mt-6 space-y-4">
            <FormError message={error} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={() => setStep('details')} className={btn('secondary', 'lg')}>
                Edit
              </button>
              <button type="button" onClick={handleSubmit} disabled={submitting} className={btn('primary', 'lg', 'sm:flex-1')}>
                {submitting ? 'Sending request' : 'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Sent ---------- */}
      {step === 'submitted' && (
        <div className="max-w-md mx-auto text-center py-12 sm:py-20">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-lake-tint text-lake">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em]">Request sent</h1>
          <p className="mt-3 text-[16px] text-ink-2">
            {getTaskTitle()} on {formatDate(date)}. We will confirm within 24 hours{user?.email ? ` and email ${user.email}` : ''}.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className={btn('primary', 'lg')}>
              Back to home
            </Link>
            <button type="button" onClick={() => resetFlow('menu')} className={btn('secondary', 'lg')}>
              Request another
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 px-5 py-4">
      <dt className="text-ink-2">{label}</dt>
      <dd className={`text-right ${strong ? 'font-semibold' : ''}`}>{value}</dd>
    </div>
  )
}

function TaskList({ tasks, past = false }: { tasks: any[]; past?: boolean }) {
  return (
    <Card>
      <ul className="divide-y divide-line">
        {tasks.map((task) => {
          const stale = past && task.status === 'requested'
          return (
            <li key={task.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-medium">{task.title}</p>
                  <p className="mt-0.5 text-[14px] text-ink-2">
                    {past ? formatShortDate(task.scheduled_date) : formatWhen(task.scheduled_date, task.scheduled_time)}
                    {task.price > 0 ? `, ${formatPrice(task.price)}` : ''}
                  </p>
                  {task.description && <p className="mt-1 text-[14px] text-ink-3 line-clamp-2">{task.description}</p>}
                </div>
                {stale ? (
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[12.5px] font-medium bg-sunk text-ink-3 whitespace-nowrap">Not confirmed</span>
                ) : (
                  <StatusChip status={task.status} />
                )}
              </div>
              {task.photo_url && (
                <a href={task.photo_url} target="_blank" rel="noreferrer" className="mt-3 block w-full sm:w-64 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={task.photo_url} alt={`Completion photo for ${task.title}`} className="aspect-[4/3] w-full object-cover bg-sunk" />
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
