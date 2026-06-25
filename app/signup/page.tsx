'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-[#5BA4CF] mt-1">Get started with Lakehouse HQ</p>
        </div>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
          />
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
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#E8A838] text-[#0A2342] py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Get Started'}
          </button>
        </div>
        <p className="text-center text-[#5BA4CF] mt-6 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-[#E8A838] hover:underline">Sign in</a>
        </p>
      </div>
    </main>
  )
}
