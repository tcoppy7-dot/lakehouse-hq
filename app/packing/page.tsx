'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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
    <main className="min-h-screen bg-[#0A2342]" style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}>
      <nav className="px-8 py-5 flex items-center justify-between border-b border-[#1B4F8A]">
        <Image src="/logo.png" alt="Lakehouse HQ" width={140} height={48} className="object-contain" />
        <a href="/dashboard" className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>Dashboard</a>
      </nav>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#1A7A8A' }}>Guests</p>
            <h1 className="text-4xl font-bold text-white">Packing Lists</h1>
            <p className="mt-2 font-light" style={{ color: '#A8D5DC' }}>Share with guests before they arrive.</p>
          </div>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
              style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
            >
              New List
            </button>
          )}
        </div>

        {adding && (
          <div className="rounded-2xl p-6 mb-8 space-y-5" style={{ backgroundColor: '#0D2B4E' }}>
            <h3 className="text-white font-bold text-lg">Create Packing List</h3>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>List Title</label>
              <input
                type="text"
                placeholder="Memorial Day Weekend, Summer Trip..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0A2342' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Items</label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={'Item ' + (index + 1)}
                      value={item.text}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="flex-1 text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                      style={{ backgroundColor: '#0A2342' }}
                    />
                    <select
                      value={item.type}
                      onChange={(e) => updateType(index, e.target.value as 'everyone' | 'claim')}
                      className="text-white px-3 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                      style={{ backgroundColor: '#0A2342' }}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="claim">Claim</option>
                    </select>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 px-2 transition-colors text-sm">
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={() => addItem('everyone')} className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>
                  + Everyone brings
                </button>
                <button onClick={() => addItem('claim')} className="text-sm font-medium transition-colors" style={{ color: '#E8A838' }}>
                  + Someone claims
                </button>
              </div>
            </div>
            <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: '#0A2342' }}>
              <p className="font-light" style={{ color: '#A8D5DC' }}><span className="text-white font-semibold">Everyone</span> means each guest needs their own, like towels or sunscreen.</p>
              <p className="font-light mt-2" style={{ color: '#A8D5DC' }}><span className="font-semibold" style={{ color: '#E8A838' }}>Claim</span> means only one is needed and a guest volunteers, like a cooler or speaker.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!title || items.filter(i => i.text.trim()).length === 0}
                className="px-6 py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
              >
                Create List
              </button>
              <button
                onClick={() => { setAdding(false); setTitle(''); setItems([{ text: '', type: 'everyone' }]) }}
                className="px-6 py-3 rounded-full text-sm font-medium transition-colors hover:text-white"
                style={{ color: '#A8D5DC' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {lists.length === 0 && !adding && (
          <div className="text-center py-24">
            <p className="text-white font-bold text-xl mb-2">No lists yet</p>
            <p className="font-light mb-8" style={{ color: '#A8D5DC' }}>Create a packing list to share with your guests.</p>
            <button onClick={() => setAdding(true)} className="px-6 py-3 rounded-full font-semibold text-sm transition-colors" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
              Create First List
            </button>
          </div>
        )}

        <div className="space-y-4">
          {lists.map((list) => (
            <div key={list.id} className="rounded-2xl p-6" style={{ backgroundColor: '#0D2B4E' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-lg">{list.title}</p>
                  <p className="text-sm font-light mt-0.5" style={{ color: '#A8D5DC' }}>{list.items.length} items</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-5">
                {list.items.slice(0, 4).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: item.type === 'claim' ? 'rgba(232,168,56,0.15)' : 'rgba(26,122,138,0.15)', color: item.type === 'claim' ? '#E8A838' : '#A8D5DC' }}>
                      {item.type === 'claim' ? 'Claim' : 'Everyone'}
                    </span>
                    <p className="text-sm font-light" style={{ color: '#A8D5DC' }}>{item.text}</p>
                  </div>
                ))}
                {list.items.length > 4 && (
                  <p className="text-sm font-light" style={{ color: '#A8D5DC' }}>and {list.items.length - 4} more items</p>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => handleCopy(list.id)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{ backgroundColor: '#1A7A8A', color: 'white' }}
                >
                  {copied === list.id ? 'Copied!' : 'Copy Link'}
                </button>
                <a href={'/packing/' + list.id} className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>
                  Preview
                </a>
                <button onClick={() => handleDelete(list.id)} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors ml-auto">
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
