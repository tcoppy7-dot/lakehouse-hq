'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '../../lib/supabase'

export default function PublicPackingList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [list, setList] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingIndex, setClaimingIndex] = useState<number | null>(null)
  const [claimName, setClaimName] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase
        .from('packing_lists')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setList(data)
        setItems(data.items.map((item: any) => ({ ...item, checked: false })))
      }
      setLoading(false)
    }
    init()
  }, [id])

  const toggleEveryone = (index: number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], checked: !updated[index].checked }
    setItems(updated)
  }

  const handleClaim = async (index: number) => {
    if (!claimName.trim()) return
    const updated = [...items]
    updated[index] = { ...updated[index], claimed_by: claimName.trim() }
    setItems(updated)
    await supabase
      .from('packing_lists')
      .update({ items: updated.map(({ checked, ...rest }) => rest) })
      .eq('id', id)
    setClaimingIndex(null)
    setClaimName('')
  }

  const handleUnclaim = async (index: number) => {
    const updated = [...items]
    updated[index] = { ...updated[index], claimed_by: null }
    setItems(updated)
    await supabase
      .from('packing_lists')
      .update({ items: updated.map(({ checked, ...rest }) => rest) })
      .eq('id', id)
  }

  if (loading) return <div className="min-h-screen bg-[#0A2342] flex items-center justify-center"><p className="text-white">Loading...</p></div>

  if (!list) return (
    <div className="min-h-screen bg-[#0A2342] flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl font-bold">List not found</p>
        <p className="text-[#5BA4CF] mt-2">This link may have expired.</p>
      </div>
    </div>
  )

  const everyoneItems = items.filter(i => i.type === 'everyone')
  const claimItems = items.filter(i => i.type === 'claim')
  const everyoneChecked = everyoneItems.filter(i => i.checked).length
  const claimsClaimed = claimItems.filter(i => i.claimed_by).length

  return (
    <main className="min-h-screen bg-[#0A2342] px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">⚓</div>
          <p className="text-[#5BA4CF] text-sm mb-2">Lakehouse HQ</p>
          <h1 className="text-white text-2xl font-bold">{list.title}</h1>
        </div>
        {everyoneItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold">Everyone Brings</p>
              <p className="text-[#5BA4CF] text-sm">{everyoneChecked} of {everyoneItems.length} checked</p>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => {
                if (item.type !== 'everyone') return null
                return (
                  <button
                    key={index}
                    onClick={() => toggleEveryone(index)}
                    className={'w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left ' + (item.checked ? 'bg-[#1A7A8A]' : 'bg-[#1B4F8A] hover:bg-[#1A7A8A]')}
                  >
                    <div className={'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ' + (item.checked ? 'bg-white border-white' : 'border-[#5BA4CF]')}>
                      {item.checked && <span className="text-[#1A7A8A] text-sm font-bold">✓</span>}
                    </div>
                    <span className={'font-medium ' + (item.checked ? 'text-white line-through opacity-70' : 'text-white')}>
                      {item.text}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {claimItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-bold">Someone Claims</p>
              <p className="text-[#5BA4CF] text-sm">{claimsClaimed} of {claimItems.length} claimed</p>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => {
                if (item.type !== 'claim') return null
                return (
                  <div key={index} className="bg-[#1B4F8A] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.text}</span>
                      {item.claimed_by ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[#E8A838] text-sm font-semibold">{item.claimed_by}</span>
                          <button onClick={() => handleUnclaim(index)} className="text-[#5BA4CF] text-xs hover:text-white transition-colors">
                            undo
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setClaimingIndex(index); setClaimName('') }}
                          className="bg-[#E8A838] text-[#0A2342] px-3 py-1 rounded-lg text-sm font-semibold hover:bg-[#d4962e] transition-colors"
                        >
                          I'll bring it
                        </button>
                      )}
                    </div>
                    {claimingIndex === index && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={claimName}
                          onChange={(e) => setClaimName(e.target.value)}
                          className="flex-1 bg-[#0A2342] text-white placeholder-[#5BA4CF] px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                        />
                        <button
                          onClick={() => handleClaim(index)}
                          disabled={!claimName.trim()}
                          className="bg-[#E8A838] text-[#0A2342] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4962e] transition-colors disabled:opacity-40"
                        >
                          Claim
                        </button>
                        <button onClick={() => setClaimingIndex(null)} className="text-[#5BA4CF] px-2 hover:text-white transition-colors text-sm">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {everyoneChecked === everyoneItems.length && claimsClaimed === claimItems.length && items.length > 0 && (
          <div className="text-center mt-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-white font-bold">All packed and ready to go!</p>
          </div>
        )}
      </div>
    </main>
  )
}
