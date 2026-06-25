'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚓</span>
          <span className="text-white font-bold text-xl">Lakehouse HQ</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-[#5BA4CF] hover:text-white text-sm transition-colors"
        >
          Sign Out
        </button>
      </nav>
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome home.
        </h1>
        <p className="text-[#5BA4CF] mb-8">Here is everything at a glance.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/property" className="bg-[#1B4F8A] rounded-2xl p-6 hover:bg-[#1A7A8A] transition-colors group">
            <div className="text-3xl mb-3">🏡</div>
            <h2 className="text-white font-bold text-lg">Property Hub</h2>
            <p className="text-[#5BA4CF] text-sm mt-1">WiFi, access codes, house info</p>
          </a>
          <a href="/tasks" className="bg-[#1B4F8A] rounded-2xl p-6 hover:bg-[#1A7A8A] transition-colors group">
            <div className="text-3xl mb-3">🔧</div>
            <h2 className="text-white font-bold text-lg">Request a Task</h2>
            <p className="text-[#5BA4CF] text-sm mt-1">Schedule services and maintenance</p>
          </a>
          <a href="/inventory" className="bg-[#1B4F8A] rounded-2xl p-6 hover:bg-[#1A7A8A] transition-colors group">
            <div className="text-3xl mb-3">📦</div>
            <h2 className="text-white font-bold text-lg">Inventory</h2>
            <p className="text-[#5BA4CF] text-sm mt-1">Track what is at the house</p>
          </a>
          <a href="/packing" className="bg-[#1B4F8A] rounded-2xl p-6 hover:bg-[#1A7A8A] transition-colors group">
            <div className="text-3xl mb-3">🧳</div>
            <h2 className="text-white font-bold text-lg">Packing Lists</h2>
            <p className="text-[#5BA4CF] text-sm mt-1">Share trip lists with guests</p>
          </a>
        </div>
      </div>
    </main>
  )
}
