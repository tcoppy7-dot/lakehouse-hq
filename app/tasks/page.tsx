'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import TaskCalendar from '../components/TaskCalendar'
import Image from 'next/image'

const TASK_MENU = [
  { title: 'Boat Cover On', price: 20, image: '/service.png', description: 'We will put your boat cover on securely' },
  { title: 'Boat Cover Off', price: 20, image: '/service.png', description: 'We will remove and store your boat cover' },
  { title: 'Jet Ski Cover On', price: 10, image: '/jetskicovered.jpg', description: 'Cover on for each jet ski' },
  { title: 'Jet Ski Cover Off', price: 10, image: '/jetskiopen.jpg', description: 'Cover off for each jet ski' },
  { title: 'Patio Furniture Up', price: 35, image: '/dock.png', description: 'Set up patio chairs and cushions' },
  { title: 'Patio Furniture Down', price: 35, image: '/dock.png', description: 'Store patio chairs and cushions' },
  { title: 'Boat Fuel Top-Off', price: 0, image: '/boatfuel.png', description: 'Charged at actual cost of fuel' },
  { title: 'Seasonal Open', price: 0, image: '/property.jpg', description: 'Full spring opening package, we will provide a quote' },
  { title: 'Seasonal Close', price: 0, image: '/property.jpg', description: 'Full fall closing package, we will provide a quote' },
  { title: 'Lawn Mowing', price: 0, image: '/lawnmowing.jpg', description: 'Lawn mowed and clippings cleared' },
  { title: 'General Maintenance', price: 0, image: '/boattubing.jpg', description: 'Describe what you need, we will provide a quote' },
]

export default function Tasks() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<'menu' | 'schedule' | 'confirm' | 'submitted'>('menu')
  const [selected, setSelected] = useState<any>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [intervalDays, setIntervalDays] = useState(14)
  const [endDate, setEndDate] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      setTasks(data || [])
      setLoading(false)
    }
    init()
  }, [router])

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${minutes} ${ampm}`
  }

  const generateRecurringTasks = async (userId: string) => {
    const start = new Date(date)
    const end = new Date(endDate)
    const taskRows = []
    let current = new Date(start)
    while (current <= end) {
      taskRows.push({
        owner_id: userId,
        title: selected.title,
        description: notes,
        scheduled_date: current.toISOString().split('T')[0],
        scheduled_time: time || null,
        status: 'requested',
        price: selected.price,
      })
      current.setDate(current.getDate() + intervalDays)
    }
    await supabase.from('tasks').insert(taskRows)
    await supabase.from('recurring_tasks').insert({
      owner_id: userId,
      title: selected.title,
      description: notes,
      interval_days: intervalDays,
      start_date: date,
      end_date: endDate,
      scheduled_time: time || null,
      price: selected.price,
      status: 'active',
    })
  }

  const handleSubmit = async () => {
    if (isRecurring && endDate) {
      await generateRecurringTasks(user.id)
    } else {
      await supabase.from('tasks').insert({
        owner_id: user.id,
        title: selected.title,
        description: notes,
        scheduled_date: date,
        scheduled_time: time || null,
        status: 'requested',
        price: selected.price,
      })
    }

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerEmail: user.email,
        taskTitle: selected.title + (isRecurring ? ' (Recurring)' : ''),
        scheduledDate: date,
        scheduledTime: time ? formatTime(time) : 'No time specified',
        price: selected.price,
        notes,
      })
    })

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setTasks(data || [])
    setStep('submitted')
  }

  const resetFlow = () => {
    setStep('menu')
    setSelected(null)
    setDate('')
    setTime('')
    setNotes('')
    setIsRecurring(false)
    setIntervalDays(14)
    setEndDate('')
  }

  const statusColor = (status: string) => {
    if (status === 'requested') return 'bg-[#E8A838] text-[#0A2342]'
    if (status === 'confirmed') return 'bg-[#1A7A8A] text-white'
    if (status === 'completed') return 'bg-green-600 text-white'
    return 'bg-[#1B4F8A] text-white'
  }

  if (loading) return <div className="min-h-screen bg-[#0A2342] flex items-center justify-center"><p className="text-white">Loading...</p></div>

  return (
    <main className="min-h-screen bg-[#0A2342]" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
      <nav className="px-8 py-5 flex items-center justify-between border-b border-[#1B4F8A]">
        <Image src="/logo.png" alt="Lakehouse HQ" width={140} height={48} className="object-contain" />
        <a href="/dashboard" className="text-sm font-medium transition-colors" style={{ color: '#A8D5DC' }}>Dashboard</a>
      </nav>

      <div className="px-8 py-10 max-w-7xl mx-auto">
        {step === 'menu' && (
          <div>
            <div className="mb-10">
              <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#1A7A8A' }}>Services</p>
              <h2 className="text-4xl font-bold text-white">What do you need done?</h2>
              <p className="mt-2 font-light" style={{ color: '#A8D5DC' }}>Select a service to get started.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {TASK_MENU.map((task) => (
                <button
                  key={task.title}
                  onClick={() => { setSelected(task); setStep('schedule') }}
                  className="relative rounded-2xl overflow-hidden h-44 group text-left"
                >
                  <Image src={task.image} alt={task.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.95) 0%, rgba(10,35,66,0.3) 100%)' }} />
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="text-white font-semibold text-sm leading-tight">{task.title}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: '#E8A838' }}>
                      {task.price > 0 ? `$${task.price}` : 'Quote'}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {tasks.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-xl">Your Requests</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView('list')}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${view === 'list' ? 'bg-[#E8A838] text-[#0A2342]' : 'bg-[#1B4F8A] text-[#5BA4CF] hover:text-white'}`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setView('calendar')}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${view === 'calendar' ? 'bg-[#E8A838] text-[#0A2342]' : 'bg-[#1B4F8A] text-[#5BA4CF] hover:text-white'}`}
                    >
                      Calendar
                    </button>
                  </div>
                </div>
                {view === 'calendar' && <TaskCalendar tasks={tasks} />}
                {view === 'list' && (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-[#1B4F8A] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-semibold">{task.title}</p>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-[#5BA4CF] text-sm">
                          {task.scheduled_date}{task.scheduled_time ? ` at ${formatTime(task.scheduled_time)}` : ''}
                        </p>
                        {task.description && <p className="text-[#5BA4CF] text-sm mt-1">{task.description}</p>}
                        {task.photo_url && (
                          <div className="mt-3">
                            <p className="text-[#5BA4CF] text-xs mb-1">Completion photo</p>
                            <img src={task.photo_url} alt="Completion" className="rounded-lg w-full max-h-40 object-cover" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'schedule' && selected && (
          <div className="max-w-lg">
            <button onClick={() => setStep('menu')} className="text-sm font-medium mb-8 transition-colors" style={{ color: '#A8D5DC' }}>
              Back to services
            </button>
            <div className="relative rounded-2xl overflow-hidden h-48 mb-8">
              <Image src={selected.image} alt={selected.title} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.9) 0%, rgba(10,35,66,0.3) 100%)' }} />
              <div className="absolute bottom-0 left-0 p-5">
                <p className="text-white font-bold text-xl">{selected.title}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: '#E8A838' }}>{selected.price > 0 ? `$${selected.price}` : 'Quote provided after review'}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                  style={{ backgroundColor: '#0D2B4E' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Preferred Time <span className="font-normal normal-case">(optional)</span></label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                  style={{ backgroundColor: '#0D2B4E' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Notes for our team <span className="font-normal normal-case">(optional)</span></label>
                <textarea
                  placeholder="Any special instructions or details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                  style={{ backgroundColor: '#0D2B4E' }}
                />
              </div>
              {selected?.title === 'Lawn Mowing' && (
                <div>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: '#0D2B4E' }}>
                    <span className="text-white text-sm font-semibold">Make this recurring</span>
                    <button
                      onClick={() => setIsRecurring(!isRecurring)}
                      className={`w-12 h-6 rounded-full transition-colors ${isRecurring ? 'bg-[#1A7A8A]' : 'bg-[#0A2342]'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${isRecurring ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  {isRecurring && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Mow every</label>
                        <select
                          value={intervalDays}
                          onChange={(e) => setIntervalDays(Number(e.target.value))}
                          className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                          style={{ backgroundColor: '#0D2B4E' }}
                        >
                          <option value={7}>7 days (weekly)</option>
                          <option value={14}>14 days (every 2 weeks)</option>
                          <option value={21}>21 days (every 3 weeks)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>End date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                          style={{ backgroundColor: '#0D2B4E' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => { if (date) setStep('confirm') }}
                disabled={!date || (isRecurring && !endDate)}
                className="w-full py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
              >
                Review Request
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && selected && (
          <div className="max-w-lg">
            <h2 className="text-white text-2xl font-bold mb-8">Confirm your request</h2>
            <div className="rounded-2xl p-6 space-y-4 mb-6" style={{ backgroundColor: '#0D2B4E' }}>
              <div className="flex justify-between">
                <span className="font-light" style={{ color: '#A8D5DC' }}>Service</span>
                <span className="text-white font-semibold">{selected.title}{isRecurring ? ' (Recurring)' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-light" style={{ color: '#A8D5DC' }}>Start Date</span>
                <span className="text-white">{date}</span>
              </div>
              {isRecurring && (
                <>
                  <div className="flex justify-between">
                    <span className="font-light" style={{ color: '#A8D5DC' }}>Frequency</span>
                    <span className="text-white">Every {intervalDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-light" style={{ color: '#A8D5DC' }}>End Date</span>
                    <span className="text-white">{endDate}</span>
                  </div>
                </>
              )}
              {time && (
                <div className="flex justify-between">
                  <span className="font-light" style={{ color: '#A8D5DC' }}>Time</span>
                  <span className="text-white">{formatTime(time)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-light" style={{ color: '#A8D5DC' }}>Price</span>
                <span className="font-bold" style={{ color: '#E8A838' }}>{selected.price > 0 ? `$${selected.price}` : 'Quote'}</span>
              </div>
              {notes && (
                <div>
                  <span className="font-light block mb-1" style={{ color: '#A8D5DC' }}>Notes</span>
                  <span className="text-white text-sm">{notes}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-full font-semibold text-sm transition-colors" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
                Submit Request
              </button>
              <button onClick={() => setStep('schedule')} className="px-6 py-3 rounded-full text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>
                Back
              </button>
            </div>
          </div>
        )}

        {step === 'submitted' && (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#1A7A8A' }}>
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Request submitted</h2>
            <p className="font-light mb-10" style={{ color: '#A8D5DC' }}>We will confirm your request shortly. Check your email for confirmation.</p>
            <button onClick={resetFlow} className="px-8 py-3 rounded-full font-semibold text-sm transition-colors" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
              Request Another Service
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
