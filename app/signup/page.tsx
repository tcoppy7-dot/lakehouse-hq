'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AuthLayout from '../components/AuthLayout'
import { Field, FormError, btn, inputClass } from '../components/ui'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Then add your house details and request your first service."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-lake hover:text-lake-dark">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleSignup()
        }}
      >
        <FormError message={error} />
        <Field label="Full name" htmlFor="name">
          <input id="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 6 characters.">
          <input id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
        <button type="submit" disabled={loading || !name || !email || password.length < 6} className={btn('primary', 'lg', 'w-full !mt-8')}>
          {loading ? 'Creating account' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
