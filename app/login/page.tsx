'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <main className="min-h-screen flex" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/wittelake.jpg" alt="Lake sunset" fill className="object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,35,66,0.3) 0%, rgba(10,35,66,0.1) 100%)' }} />
        <div className="absolute bottom-10 left-10">
          <Image src="/logo.png" alt="Lakehouse HQ" width={160} height={54} className="object-contain" />
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12" style={{ backgroundColor: '#0A2342' }}>
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <Image src="/logo.png" alt="Lakehouse HQ" width={140} height={48} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back.</h1>
          <p className="text-sm font-light mb-10" style={{ color: '#A8D5DC' }}>Sign in to your Lakehouse HQ account.</p>
          {error && <p className="text-red-400 text-sm mb-6">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0D2B4E' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0D2B4E' }}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          <p className="text-center mt-8 text-sm font-light" style={{ color: '#A8D5DC' }}>
            No account yet?{' '}
            <a href="/signup" className="font-medium hover:underline" style={{ color: '#E8A838' }}>Get started</a>
          </p>
        </div>
      </div>
    </main>
  )
}
