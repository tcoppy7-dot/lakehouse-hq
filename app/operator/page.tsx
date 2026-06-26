'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import TaskCalendar from '../components/TaskCalendar'

export default function OperatorDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [authorized, setAuthorized] = useState(false)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [uploading, setUploading] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      console.log('profile:', profile, 'error:', error)

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
    const { data, error } = await supabase
      .from('tasks')
      .select('*, profiles(full_name)')
      .order('scheduled_date', { ascending: true })
    console.log('tasks:', data, 'error:', error)
    setTasks(data || [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('tasks').update({ status }).eq('id', id)
    await loadTasks()
  }

  const handlePhotoUpload = async (taskId: string, file: File) => {
    setUploading(taskId)
    const ext = file.name.split('.').pop()
    const path = `${taskId}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('task-photos')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      console.error('Upload error:', uploadError)
      setUploading(null)
      return
    }
    const { data: { publicUrl } } = supabase.storage
      .from('task-photos')
      .getPublicUrl(path)
    await supabase.from('tasks').update({ photo_url: publicUrl }).eq('id', taskId)
    await loadTasks()
    setUploading(null)
  }

  const statusColor = (status: string) => {
    if (status === 'requested') return 'bg-[#E8A838] text-[#0A2342]'
    if (status === 'confirmed') return 'bg-[#1A7A8A] text-white'
    if (status === 'in_progress') return 'bg-purple-600 text-white'
    if (status === 'completed') return 'bg-green-600 text-white'
    return 'bg-[#1B4F8A] text-white'
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  if (loading) return <div className="min-h-screen bg-[#0A2342] flex items-center justify-center"><p className="text-white">Loading...</p></div>

  if (!authorized) return null

  return (
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚓</span>
          <span className="text-white font-bold text-xl">Operator Dashboard</span>
        </div>
        <a href="/dashboard" className="text-[#5BA4CF] hover:text-white text-sm transition-colors">My Dashboard</a>
      </nav>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">All Task Requests</h2>
            <p className="text-[#5BA4CF] text-sm">{tasks.length} total requests</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('list')}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${view === 'list' ? 'bg-[#E8A838] text-[#0A2342]' : 'bg-[#1B4F8A] text-[#5BA4CF] hover:text-white'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${view === 'calendar' ? 'bg-[#E8A838] text-[#0A2342]' : 'bg-[#1B4F8A] text-[#5BA4CF] hover:text-white'}`}
            >
              Calendar
            </button>
          </div>
        </div>
        {view === 'calendar' && <TaskCalendar tasks={tasks} />}
        {view === 'list' && (
          <>
            <div className="flex gap-2 flex-wrap mb-6">
              {['all', 'requested', 'confirmed', 'in_progress', 'completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${filter === s ? 'bg-[#E8A838] text-[#0A2342]' : 'bg-[#1B4F8A] text-[#5BA4CF] hover:text-white'}`}
                >
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-white font-bold text-lg">No requests yet</p>
                <p className="text-[#5BA4CF] text-sm mt-1">Task requests will appear here when owners submit them.</p>
              </div>
            )}
            <div className="space-y-4">
              {filtered.map((task) => (
                <div key={task.id} className="bg-[#1B4F8A] rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-bold text-lg">{task.title}</p>
                      <p className="text-[#5BA4CF] text-sm">
                        {task.profiles?.full_name || 'Unknown owner'}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(task.status)}`}>
                      {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0A2342] rounded-lg p-3">
                      <p className="text-[#5BA4CF] text-xs mb-1">Scheduled Date</p>
                      <p className="text-white text-sm">{task.scheduled_date || 'Not set'}</p>
                    </div>
                    <div className="bg-[#0A2342] rounded-lg p-3">
                      <p className="text-[#5BA4CF] text-xs mb-1">Price</p>
                      <p className="text-[#E8A838] text-sm font-bold">{task.price > 0 ? `$${task.price}` : 'Quote needed'}</p>
                    </div>
                  </div>
                  {task.description && (
                    <div className="bg-[#0A2342] rounded-lg p-3 mb-4">
                      <p className="text-[#5BA4CF] text-xs mb-1">Notes from owner</p>
                      <p className="text-white text-sm">{task.description}</p>
                    </div>
                  )}
                  {task.photo_url && (
                    <div className="mb-4">
                      <p className="text-[#5BA4CF] text-xs mb-2">Completion photo</p>
                      <img src={task.photo_url} alt="Completion" className="rounded-lg w-full max-h-48 object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {task.status === 'requested' && (
                      <button onClick={() => updateStatus(task.id, 'confirmed')} className="bg-[#1A7A8A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065A82] transition-colors">
                        Confirm
                      </button>
                    )}
                    {task.status === 'confirmed' && (
                      <button onClick={() => updateStatus(task.id, 'in_progress')} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                        Mark In Progress
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button onClick={() => updateStatus(task.id, 'completed')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                        Mark Complete
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <label className="cursor-pointer bg-[#1A7A8A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065A82] transition-colors">
                        {uploading === task.id ? 'Uploading...' : task.photo_url ? 'Replace Photo' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handlePhotoUpload(task.id, file)
                          }}
                        />
                      </label>
                    )}
                    {task.status !== 'completed' && (
                      <button onClick={() => updateStatus(task.id, 'requested')} className="text-[#5BA4CF] px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
