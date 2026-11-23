'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '../../lib/supabase'
import { LoadingScreen, btn, inputClass } from '../../components/ui'

export default function PublicPackingList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [list, setList] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)
  const [claimName, setClaimName] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.from('packing_lists').select('*').eq('id', id).single()
      if (data) {
        setList(data)
        setItems(data.items.map((item: any) => ({ ...item, checked: false })))
        const saved = window.localStorage?.getItem('lakehouse-guest-name')
        if (saved) setClaimName(saved)
      }
      setLoading(false)
    }
    init()
  }, [id])

  const persist = async (updated: any[]) => {
    await supabase
      .from('packing_lists')
      .update({ items: updated.map(({ checked, ...rest }) => rest) })
      .eq('id', id)
  }

  const toggleEveryone = (index: number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], checked: !updated[index].checked }
    setItems(updated)
  }

  const handleClaim = async (index: number) => {
    const name = claimName.trim()
    if (!name) return
    try { window.localStorage?.setItem('lakehouse-guest-name', name) } catch {}
    const updated = [...items]
    updated[index] = { ...updated[index], claimed_by: name }
    setItems(updated)
    setClaimingIndex(null)
    await persist(updated)
  }

  const handleUnclaim = async (index: number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], claimed_by: null }
    setItems(updated)
    await persist(updated)
  }

  if (loading) return <LoadingScreen />

  if (!list) {
    return (
      <main className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-sm">
          <p className="text-[20px] font-semibold">This list is not available</p>
          <p className="mt-2 text-[15px] text-ink-2">The link may be mistyped, or the owner deleted the list. Ask them to send it again.</p>
        </div>
      </main>
    )
  }

  const everyoneItems = items.filter((i) => i.type === 'everyone')
  const claimItems = items.filter((i) => i.type === 'claim')
  const everyoneChecked = everyoneItems.filter((i) => i.checked).length
  const claimsClaimed = claimItems.filter((i) => i.claimed_by).length
  const allDone = items.length > 0 && everyoneChecked === everyoneItems.length && claimsClaimed === claimItems.length

  return (
    <main className="flex-1 px-5 py-10 sm:py-16">
      <div className="max-w-md mx-auto">
        <p className="font-display text-[17px] text-ink-2">Lakehouse HQ</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] leading-tight">{list.title}</h1>
        <p className="mt-2 text-[15px] text-ink-2">Check off what you are packing. For shared items, tap the one you will bring so nobody doubles up.</p>

        {everyoneItems.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[17px] font-semibold">Everyone brings</h2>
              <p className="text-[14px] text-ink-3 tabular-nums">
                {everyoneChecked} of {everyoneItems.length} packed
              </p>
            </div>
            <ul className="rounded-2xl border border-line bg-surface divide-y divide-line">
              {items.map((item, index) => {
                if (item.type !== 'everyone') return null
                return (
                  <li key={index}>
                    <button
                      onClick={() => toggleEveryone(index)}
                      aria-pressed={item.checked}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    >
                      <span
                        aria-hidden
                        className={`h-6 w-6 shrink-0 rounded-full border-2 grid place-items-center transition-colors ${item.checked ? 'bg-lake border-lake text-white' : 'border-line'}`}
                      >
                        {item.checked && (
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-[16px] ${item.checked ? 'text-ink-3 line-through' : ''}`}>{item.text}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {claimItems.length > 0 && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[17px] font-semibold">One person brings</h2>
              <p className="text-[14px] text-ink-3 tabular-nums">
                {claimsClaimed} of {claimItems.length} claimed
              </p>
            </div>
            <ul className="rounded-2xl border border-line bg-surface divide-y divide-line">
              {items.map((item, index) => {
                if (item.type !== 'claim') return null
                return (
                  <li key={index} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[16px]">{item.text}</span>
                      {item.claimed_by ? (
                        <span className="flex items-center gap-3 text-[14px]">
                          <span className="text-ink-2">{item.claimed_by}</span>
                          <button onClick={() => handleUnclaim(index)} className="font-medium text-lake hover:text-lake-dark">
                            Undo
                          </button>
                        </span>
                      ) : (
                        claimingIndex !== index && (
                          <button onClick={() => setClaimingIndex(index)} className={btn('secondary', 'sm')}>
                            I will bring it
                          </button>
                        )
                      )}
                    </div>
                    {claimingIndex === index && (
                      <form
                        className="mt-3 flex gap-2"
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleClaim(index)
                        }}
                      >
                        <label htmlFor={`claim-${index}`} className="sr-only">
                          Your name
                        </label>
                        <input id={`claim-${index}`} autoFocus type="text" placeholder="Your name" value={claimName} onChange={(e) => setClaimName(e.target.value)} className={inputClass + ' flex-1 min-w-0'} />
                        <button type="submit" disabled={!claimName.trim()} className={btn('primary', 'md')}>
                          Claim
                        </button>
                        <button type="button" onClick={() => setClaimingIndex(null)} className={btn('quiet', 'md', '!px-3')}>
                          Cancel
                        </button>
                      </form>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {allDone && <p className="mt-10 rounded-2xl bg-lake-tint px-5 py-4 text-[15px] text-lake-dark font-medium">Everything is packed and claimed.</p>}
      </div>
    </main>
  )
}
