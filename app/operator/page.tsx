'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell from '../components/AppShell'
import TaskCalendar from '../components/TaskCalendar'
import { Card, EmptyState, LoadingScreen, PageHeader, StatusChip, btn } from '../components/ui'
import { formatPrice, formatWhen } from '../lib/format'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'requested', label: 'To confirm' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'completed', label: 'Done' },
]

const NEXT_ACTION: Record<string, { to: string; label: string }> = {
  requested: { to: 'confirmed', label: 'Confirm' },
  confirmed: { to: 'in_progress', label: 'Start job' },
  in_progress: { to: 'completed', label: 'Mark done' },
}

export default function OperatorDashboard() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('requested')
  const [authorized, setAuthorized] = useState(false)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [uploading, setUploading] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (!profile || profile.role !== 'admin') {
        router.push('/dashboard')
        return
      }
      setAuthorized(true)
      await loadTasks()
    }
    init()
  }, [router])

  const loadTasks = async () => {
    const { data } = await supabase.from('tasks').select('*, profiles(full_name)').order('scheduled_date', { ascending: true })
    setTasks(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setBusy(id)
    await supabase.from('tasks').update({ status }).eq('id', id)
    await loadTasks()
    setBusy(null)
  }

  const handlePhotoUpload = async (taskId: string, file: File) => {
    setUploading(taskId)
    setError(null)
    const ext = file.name.split('.').pop()
    const path = `${taskId}.${ext}`
    const { error: uploadError } = await supabase.storage.from('task-photos').upload(path, file, { upsert: true })
    if (uploadError) {
      setError('The photo did not upload. Check the connection and try again.')
      setUploading(null)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('task-photos').getPublicUrl(path)
    await supabase.from('tasks').update({ photo_url: publicUrl }).eq('id', taskId)
    await loadTasks()
    setUploading(null)
  }

  if (loading || !authorized) {
    return (
      <AppShell wide>
        <LoadingScreen />
      </AppShell>
    )
  }

  const counts: Record<string, number> = { all: tasks.length }
  tasks.forEach((t) => (counts[t.status] = (counts[t.status] || 0) + 1))
  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <AppShell wide>
      <PageHeader
        title="Jobs"
        description={`Customer requests for you to confirm, do, and photograph. ${counts.requested ? `${counts.requested} waiting to be confirmed.` : 'Nothing waiting to be confirmed.'}`}
        action={
          <div className="inline-flex rounded-full bg-sunk p-1" role="tablist" aria-label="View">
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
        }
      />

      {error && <p role="alert" className="mb-6 rounded-xl bg-danger/8 px-4 py-3 text-[14px] text-danger">{error}</p>}

      {view === 'calendar' && <TaskCalendar tasks={tasks} showOwnerName />}

      {view === 'list' && (
        <>
          <div className="no-scrollbar -mx-5 px-5 mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`h-9 px-4 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors ${
                  filter === f.key ? 'bg-ink text-white' : 'bg-surface border border-line text-ink-2 hover:text-ink'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 tabular-nums ${filter === f.key ? 'text-white/70' : 'text-ink-3'}`}>{counts[f.key] || 0}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              title={filter === 'all' ? 'No requests yet' : 'Nothing here'}
              body={filter === 'all' ? 'Requests show up here as soon as an owner sends one.' : 'No requests have this status right now.'}
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((task) => {
                const next = NEXT_ACTION[task.status]
                return (
                  <Card key={task.id} className="p-5 sm:p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[18px] font-semibold">{task.title}</p>
                        <p className="mt-0.5 text-[14px] text-ink-2">{task.profiles?.full_name || 'Owner name not set'}</p>
                      </div>
                      <StatusChip status={task.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-[14px]">
                      <div>
                        <dt className="text-ink-3">When</dt>
                        <dd className="mt-0.5">{formatWhen(task.scheduled_date, task.scheduled_time)}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">Price</dt>
                        <dd className="mt-0.5 font-medium">{task.price > 0 ? formatPrice(task.price) : 'Needs a quote'}</dd>
                      </div>
                    </dl>
                    {task.description && (
                      <p className="mt-4 rounded-xl bg-sunk px-4 py-3 text-[14px] text-ink-2">
                        <span className="font-medium text-ink">Owner note: </span>
                        {task.description}
                      </p>
                    )}
                    {task.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={task.photo_url} alt={`Completion photo for ${task.title}`} className="mt-4 rounded-xl w-full aspect-[16/9] object-cover bg-sunk" />
                    )}
                    <div className="mt-5 pt-4 border-t border-line flex flex-wrap gap-2 items-center">
                      {next && (
                        <button onClick={() => updateStatus(task.id, next.to)} disabled={busy === task.id} className={btn('primary', 'md')}>
                          {next.label}
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <label className={btn(task.photo_url ? 'secondary' : 'primary', 'md', 'cursor-pointer focus-within:outline-2 focus-within:outline-lake')}>
                          {uploading === task.id ? 'Uploading photo' : task.photo_url ? 'Replace photo' : 'Add completion photo'}
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handlePhotoUpload(task.id, file)
                            }}
                          />
                        </label>
                      )}
                      {task.status !== 'completed' && task.status !== 'requested' && (
                        <button onClick={() => updateStatus(task.id, 'requested')} className={btn('quiet', 'md')}>
                          Reset to requested
                        </button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </AppShell>
  )
}
