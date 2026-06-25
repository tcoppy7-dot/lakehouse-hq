'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0A2342] flex items-center justify-center px-6">
      <div className="bg-[#1B4F8A] rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚓</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-[#5BA4CF] mt-1">Sign in to Lakehouse HQ</p>
        </div>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1A7A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#065A82] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        <p className="text-center text-[#5BA4CF] mt-6 text-sm">
          No account yet?{' '}
          <a href="/signup" className="text-[#E8A838] hover:underline">Get started</a>
        </p>
      </div>
    </main>
  )
}
