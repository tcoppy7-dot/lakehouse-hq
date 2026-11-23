'use client'
import { useState } from 'react'

// Shows a sensitive value (door code, WiFi password) masked until the owner asks to see it.
export default function Secret({ value, label }: { value?: string | null; label: string }) {
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!value) return <span className="text-ink-3">Not set</span>

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setShown(true)
    }
  }

  return (
    <span className="inline-flex items-center gap-3 flex-wrap">
      <span className="font-medium tabular-nums tracking-wide" aria-live="polite">
        {shown ? value : '•'.repeat(Math.min(Math.max(value.length, 4), 10))}
      </span>
      <button
        type="button"
        onClick={() => setShown(!shown)}
        className="text-[14px] text-lake hover:text-lake-dark font-medium"
        aria-label={`${shown ? 'Hide' : 'Show'} ${label}`}
      >
        {shown ? 'Hide' : 'Show'}
      </button>
      <button type="button" onClick={copy} className="text-[14px] text-lake hover:text-lake-dark font-medium" aria-label={`Copy ${label}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  )
}
