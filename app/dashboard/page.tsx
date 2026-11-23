'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell, { NavIcon } from '../components/AppShell'
import Secret from '../components/Secret'
import { Card, EmptyState, LoadingScreen, SectionTitle, StatusChip, btn } from '../components/ui'
import { firstName, formatDate, formatShortDate, formatWhen, isUpcoming, todayKey } from '../lib/format'

const STATUS_NOTE: Record<string, string> = {
  requested: 'Waiting for us to confirm. We confirm within 24 hours.',
  confirmed: 'You will get a photo when it is done.',
  in_progress: 'Our team is working on it now.',
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [property, setProperty] = useState<any>(null)
  const [inventoryCount, setInventoryCount] = useState(0)
  const [packingCount, setPackingCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setName(firstName(user))
      const [t, p, inv, pack] = await Promise.all([
        supabase.from('tasks').select('*').eq('owner_id', user.id).order('scheduled_date', { ascending: true }),
        supabase.from('properties').select('*').eq('owner_id', user.id).maybeSingle(),
        supabase.from('inventory').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
        supabase.from('packing_lists').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
      ])
      setTasks(t.data || [])
      setProperty(p.data)
      setInventoryCount(inv.count || 0)
      setPackingCount(pack.count || 0)
      setReady(true)
    }
    load()
  }, [router])

  if (!ready) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    )
  }

  const upcoming = tasks.filter(isUpcoming)
  const next = upcoming[0]
  const alsoScheduled = upcoming.slice(1, 4)
  const lastDone = [...tasks]
    .filter((t) => t.status === 'completed')
    .sort((a, b) => (b.scheduled_date || '').localeCompare(a.scheduled_date || ''))[0]
  const unconfirmedPast = tasks.filter((t) => t.status === 'requested' && t.scheduled_date && t.scheduled_date < todayKey()).length

  return (
    <AppShell>
      {/* Greeting and primary action */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-10">
        <div>
          <h1 className="text-[30px] sm:text-[36px] font-semibold tracking-[-0.02em] leading-[1.1]">
            {greeting()}
            {name ? `, ${name}` : ''}
          </h1>
          {property?.name && <p className="mt-2 text-[16px] text-ink-2">{property.name}</p>}
        </div>
        <Link href="/tasks?new=1" className={btn('primary', 'lg', 'w-full sm:w-auto')}>
          Request a service
        </Link>
      </div>

      {/* Phones read top to bottom: next visit, house, then the last finished job. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-10 lg:items-start">
        <section aria-labelledby="next-visit" className="lg:col-start-1 lg:row-start-1">
          <SectionTitle
            action={
              <Link href="/tasks" className="text-[14px] font-medium text-lake hover:text-lake-dark">
                View all
              </Link>
            }
          >
            <span id="next-visit">Next visit</span>
          </SectionTitle>

          {next ? (
            <Card className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <p className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] leading-tight">{next.title}</p>
                <StatusChip status={next.status} />
              </div>
              <p className="mt-2 text-[16px] text-ink">{formatWhen(next.scheduled_date, next.scheduled_time)}</p>
              {STATUS_NOTE[next.status] && <p className="mt-4 text-[15px] text-ink-2">{STATUS_NOTE[next.status]}</p>}
              {next.description && (
                <p className="mt-4 rounded-xl bg-sunk px-4 py-3 text-[15px] text-ink-2">
                  <span className="text-ink font-medium">Your note: </span>
                  {next.description}
                </p>
              )}
              {alsoScheduled.length > 0 && (
                <div className="mt-6 border-t border-line pt-4">
                  <p className="text-[13px] font-medium text-ink-3 mb-2">Also scheduled</p>
                  <ul className="divide-y divide-line">
                    {alsoScheduled.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-4 py-2.5 text-[15px]">
                        <span className="truncate">{t.title}</span>
                        <span className="text-ink-2 whitespace-nowrap">{formatShortDate(t.scheduled_date)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 sm:p-7">
              <p className="text-[20px] font-semibold tracking-[-0.01em]">Nothing scheduled</p>
              <p className="mt-2 text-[15px] text-ink-2 max-w-md">
                Request a service and your next visit will show up here, with its status as we confirm and finish it.
              </p>
              {unconfirmedPast > 0 && (
                <p className="mt-4 rounded-xl bg-sunk px-4 py-3 text-[14px] text-ink-2">
                  {unconfirmedPast === 1 ? 'One past request was' : `${unconfirmedPast} past requests were`} never confirmed.{' '}
                  <Link href="/tasks" className="font-medium text-lake hover:text-lake-dark">
                    Review requests
                  </Link>
                </p>
              )}
            </Card>
          )}
        </section>

        {/* Shortcuts to every section, so nothing is more than one tap from Home */}
        <nav aria-label="Go to" className="lg:col-start-1 lg:col-span-2 lg:row-start-2">
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { href: '/tasks', icon: 'list' as const, title: 'Services', body: 'Request or check on a service' },
              { href: '/property', icon: 'key' as const, title: 'House info', body: 'Door code, WiFi, and boat details' },
              {
                href: '/inventory',
                icon: 'box' as const,
                title: 'Inventory',
                body: inventoryCount === 0 ? 'Track what is at the house' : `${inventoryCount} ${inventoryCount === 1 ? 'item' : 'items'} tracked`,
              },
              {
                href: '/packing',
                icon: 'bag' as const,
                title: 'Packing lists',
                body: packingCount === 0 ? 'Share what to bring with guests' : `${packingCount} ${packingCount === 1 ? 'list' : 'lists'} for guests`,
              },
            ].map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:p-5 transition-colors hover:border-ink-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-lake-tint text-lake">
                    <NavIcon name={t.icon} />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold">{t.title}</span>
                    <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{t.body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-start-2 lg:row-start-1">
          <section aria-labelledby="house">
            <SectionTitle
              action={
                property && (
                  <Link href="/property" className="text-[14px] font-medium text-lake hover:text-lake-dark">
                    House info
                  </Link>
                )
              }
            >
              <span id="house">House</span>
            </SectionTitle>
            {property ? (
              <Card>
                <dl className="divide-y divide-line text-[15px]">
                  {property.address && (
                    <div className="px-5 py-4">
                      <dt className="text-[13px] text-ink-3">Address</dt>
                      <dd className="mt-1">{property.address}</dd>
                    </div>
                  )}
                  <div className="px-5 py-4">
                    <dt className="text-[13px] text-ink-3">Door code</dt>
                    <dd className="mt-1">
                      <Secret value={property.access_code} label="door code" />
                    </dd>
                  </div>
                  <div className="px-5 py-4">
                    <dt className="text-[13px] text-ink-3">WiFi</dt>
                    <dd className="mt-1">{property.wifi_name || <span className="text-ink-3">Not set</span>}</dd>
                    {property.wifi_password && (
                      <dd className="mt-1.5">
                        <Secret value={property.wifi_password} label="WiFi password" />
                      </dd>
                    )}
                  </div>
                </dl>
              </Card>
            ) : (
              <EmptyState
                title="Add your house details"
                body="Keep the address, door code, WiFi, and boat info in one place for you and our team."
                action={
                  <Link href="/property" className={btn('secondary', 'md')}>
                    Add house details
                  </Link>
                }
              />
            )}
          </section>
        </div>

        <section aria-labelledby="last-done" className="lg:col-start-1 lg:row-start-3">
          <SectionTitle>
            <span id="last-done">Last finished</span>
          </SectionTitle>
          {lastDone ? (
            <Card className="overflow-hidden">
              {lastDone.photo_url && (
                // Completion photos come from Supabase Storage, so a plain img keeps the remote config simple.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={lastDone.photo_url} alt={`Completion photo for ${lastDone.title}`} className="w-full aspect-[16/9] object-cover bg-sunk" />
              )}
              <div className="p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[16px] font-semibold">{lastDone.title}</p>
                  <p className="mt-1 text-[14px] text-ink-2">{formatDate(lastDone.scheduled_date)}</p>
                </div>
                <StatusChip status="completed" />
              </div>
            </Card>
          ) : (
            <p className="text-[15px] text-ink-2">When we finish a job, the completion photo will appear here.</p>
          )}
        </section>
      </div>
    </AppShell>
  )
}
