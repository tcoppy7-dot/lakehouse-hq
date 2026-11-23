'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/AuthLayout'
import { Field, FormError, btn, inputClass } from '../components/ui'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'That email and password do not match. Check both and try again.'
          : error.message
      )
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Check on your house and request services."
      footer={
        <>
          New to Lakehouse HQ?{' '}
          <Link href="/signup" className="font-medium text-lake hover:text-lake-dark">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
      >
        <FormError message={error} />
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" htmlFor="password">
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        <button type="submit" disabled={loading || !email || !password} className={btn('primary', 'lg', 'w-full !mt-8')}>
          {loading ? 'Signing in' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
