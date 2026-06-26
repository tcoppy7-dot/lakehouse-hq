'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [recentTask, setRecentTask] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      if (tasks && tasks.length > 0) setRecentTask(tasks[0])
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const statusColor = (status: string) => {
    if (status === 'requested') return 'bg-[#E8A838] text-[#0A2342]'
    if (status === 'confirmed') return 'bg-[#1A7A8A] text-white'
    if (status === 'in_progress') return 'bg-purple-600 text-white'
    if (status === 'completed') return 'bg-green-600 text-white'
    return 'bg-[#1B4F8A] text-white'
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#0A2342] px-6 py-4 flex items-center justify-between border-b border-[#1B4F8A]">
        <Image src="/logo.png" alt="Lakehouse HQ" width={140} height={48} className="object-contain" />
        <button
          onClick={handleSignOut}
          className="text-[#5BA4CF] hover:text-white text-sm transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <div className="relative h-48 overflow-hidden">
        <Image src="/sunset.jpg" alt="Lake sunset" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,35,66,0.4) 0%, rgba(10,35,66,0.85) 100%)' }} />
        <div className="relative z-10 px-6 h-full flex flex-col justify-end pb-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Welcome home.</h1>
          <p className="text-[#5BA4CF] text-sm mt-1">Here is everything at a glance.</p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        {recentTask && (
          <a href="/tasks" className="block mb-6 bg-[#1B4F8A] rounded-2xl p-4 hover:bg-[#1A7A8A] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5BA4CF] text-xs mb-1">Most recent request</p>
                <p className="text-white font-bold">{recentTask.title}</p>
                <p className="text-[#5BA4CF] text-sm mt-0.5">{recentTask.scheduled_date || 'No date set'}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(recentTask.status)}`}>
                {recentTask.status === 'in_progress' ? 'In Progress' : recentTask.status.charAt(0).toUpperCase() + recentTask.status.slice(1)}
              </span>
            </div>
          </a>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/property" className="relative rounded-2xl overflow-hidden h-44 group">
            <Image src="/property.jpg" alt="Property Hub" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.9) 0%, rgba(10,35,66,0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-white font-bold text-lg">Property Hub</p>
              <p className="text-[#5BA4CF] text-sm">WiFi, access codes, house info</p>
            </div>
          </a>

          <a href="/tasks" className="relative rounded-2xl overflow-hidden h-44 group">
            <Image src="/service.png" alt="Request a Task" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.9) 0%, rgba(10,35,66,0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-white font-bold text-lg">Request a Task</p>
              <p className="text-[#5BA4CF] text-sm">Schedule services and maintenance</p>
            </div>
          </a>

          <a href="/inventory" className="relative rounded-2xl overflow-hidden h-44 group">
            <Image src="/pantry.jpg" alt="Inventory" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.9) 0%, rgba(10,35,66,0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-white font-bold text-lg">Inventory</p>
              <p className="text-[#5BA4CF] text-sm">Track what is at the house</p>
            </div>
          </a>

          <a href="/packing" className="relative rounded-2xl overflow-hidden h-44 group">
            <Image src="/packing.png" alt="Packing Lists" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,35,66,0.9) 0%, rgba(10,35,66,0.3) 100%)' }} />
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-white font-bold text-lg">Packing Lists</p>
              <p className="text-[#5BA4CF] text-sm">Share trip lists with guests</p>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}
