'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function PackingLists() {
  const [user, setUser] = useState<any>(null)
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<{ text: string; type: 'everyone' | 'claim' }[]>([{ text: '', type: 'everyone' }])
  const [copied, setCopied] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await loadLists(user.id)
    }
    init()
  }, [router])

  const loadLists = async (uid: string) => {
    const { data } = await supabase
      .from('packing_lists')
      .select('*')
      .eq('owner_id', uid)
      .order('created_at', { ascending: false })
    setLists(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    const filtered = items.filter(i => i.text.trim() !== '')
    if (!title || filtered.length === 0) return
    await supabase.from('packing_lists').insert({
      owner_id: user.id,
      title,
      items: filtered.map(item => ({ text: item.text, type: item.type, checked: false, claimed_by: null }))
    })
    await loadLists(user.id)
    setTitle('')
    setItems([{ text: '', type: 'everyone' }])
    setAdding(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('packing_lists').delete().eq('id', id)
    await loadLists(user.id)
  }

  const handleCopy = (id: string) => {
    const url = window.location.origin + '/packing/' + id
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const addItem = (type: 'everyone' | 'claim') => setItems([...items, { text: '', type }])
  const updateItem = (index: number, text: string) => {
    const updated = [...items]
    updated[index] = { ...updated[index], text }
    setItems(updated)
  }
  const updateType = (index: number, type: 'everyone' | 'claim') => {
    const updated = [...items]
    updated[index] = { ...updated[index], type }
    setItems(updated)
  }
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  if (loading) return <div className="min-h-screen bg-[#0A2342] flex items-center justify-center"><p className="text-white">Loading...</p></div>

  return (
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="text-2xl">⚓</a>
          <span className="text-white font-bold text-xl">Packing Lists</span>
        </div>
        <a href="/dashboard" className="text-[#5BA4CF] hover:text-white text-sm transition-colors">Dashboard</a>
      </nav>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">Trip Packing Lists</h2>
            <p className="text-[#5BA4CF] text-sm">Share with guests before they arrive</p>
          </div>
          {!adding && (
            <button onClick={() => setAdding(true)} className="bg-[#E8A838] text-[#0A2342] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4962e] transition-colors">
              New List
            </button>
          )}
        </div>
        {adding && (
          <div className="bg-[#1B4F8A] rounded-xl p-5 mb-6 space-y-4">
            <h3 className="text-white font-bold">Create Packing List</h3>
            <div>
              <label className="text-[#5BA4CF] text-sm mb-1 block">List Title</label>
              <input
                type="text"
                placeholder="Memorial Day Weekend, Summer Trip..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
              />
            </div>
            <div>
              <label className="text-[#5BA4CF] text-sm mb-2 block">Items</label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={'Item ' + (index + 1)}
                      value={item.text}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="flex-1 bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                    />
                    <select
                      value={item.type}
                      onChange={(e) => updateType(index, e.target.value as 'everyone' | 'claim')}
                      className="bg-[#0A2342] text-white px-3 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="claim">Claim</option>
                    </select>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 px-2 transition-colors">
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-3">
                <button onClick={() => addItem('everyone')} className="text-[#5BA4CF] text-sm hover:text-white transition-colors">
                  + Everyone brings
                </button>
                <button onClick={() => addItem('claim')} className="text-[#E8A838] text-sm hover:text-white transition-colors">
                  + Someone claims
                </button>
              </div>
            </div>
            <div className="bg-[#0A2342] rounded-lg p-3 text-sm">
              <p className="text-[#5BA4CF]"><span className="text-white font-semibold">Everyone</span> - each guest needs their own (towels, sunscreen)</p>
              <p className="text-[#5BA4CF] mt-1"><span className="text-[#E8A838] font-semibold">Claim</span> - only one needed, a guest volunteers (cooler, speaker)</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!title || items.filter(i => i.text.trim()).length === 0}
                className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors disabled:opacity-40"
              >
                Create List
              </button>
              <button onClick={() => { setAdding(false); setTitle(''); setItems([{ text: '', type: 'everyone' }]) }} className="text-[#5BA4CF] px-6 py-3 rounded-lg hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
        {lists.length === 0 && !adding && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧳</div>
            <p className="text-white font-bold text-lg">No lists yet</p>
            <p className="text-[#5BA4CF] text-sm mt-1 mb-6">Create a packing list to share with your guests.</p>
            <button onClick={() => setAdding(true)} className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors">
              Create First List
            </button>
          </div>
        )}
        <div className="space-y-4">
          {lists.map((list) => (
            <div key={list.id} className="bg-[#1B4F8A] rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-lg">{list.title}</p>
                  <p className="text-[#5BA4CF] text-sm">{list.items.length} items</p>
                </div>
              </div>
              <div className="space-y-1 mb-4">
                {list.items.slice(0, 4).map((item: any, i: number) => (
                  <p key={i} className="text-[#5BA4CF] text-sm">
                    {item.type === 'claim' ? '🙋 ' : '· '}{item.text}
                  </p>
                ))}
                {list.items.length > 4 && (
                  <p className="text-[#5BA4CF] text-sm">· and {list.items.length - 4} more...</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(list.id)}
                  className="bg-[#1A7A8A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#065A82] transition-colors"
                >
                  {copied === list.id ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={'/packing/' + list.id} className="text-[#5BA4CF] px-4 py-2 rounded-lg text-sm hover:text-white transition-colors">
                  Preview
                </a>
                <button onClick={() => handleDelete(list.id)} className="text-red-400 text-sm hover:text-red-300 transition-colors ml-auto">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
