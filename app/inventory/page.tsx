'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const CONDITIONS = ['good', 'fair', 'poor', 'missing']

const conditionColor = (condition: string) => {
  if (condition === 'good') return 'bg-green-600 text-white'
  if (condition === 'fair') return 'bg-[#E8A838] text-[#0A2342]'
  if (condition === 'poor') return 'bg-red-500 text-white'
  if (condition === 'missing') return 'bg-gray-600 text-white'
  return 'bg-[#1B4F8A] text-white'
}

export default function Inventory() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', quantity: '1', condition: 'good', location: '', notes: '' })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await loadItems(user.id)
    }
    init()
  }, [router])

  const loadItems = async (uid: string) => {
    const { data } = await supabase
      .from('inventory')
      .select('*')
      .eq('owner_id', uid)
      .order('name', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setForm({ name: '', quantity: '1', condition: 'good', location: '', notes: '' })
    setAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    const payload = { ...form, quantity: parseInt(form.quantity) || 1, owner_id: user.id }
    if (editingId) {
      await supabase.from('inventory').update(payload).eq('id', editingId)
    } else {
      await supabase.from('inventory').insert(payload)
    }
    await loadItems(user.id)
    resetForm()
  }

  const handleEdit = (item: any) => {
    setForm({
      name: item.name,
      quantity: String(item.quantity),
      condition: item.condition,
      location: item.location || '',
      notes: item.notes || ''
    })
    setEditingId(item.id)
    setAdding(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('inventory').delete().eq('id', id)
    await loadItems(user.id)
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
            <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#1A7A8A' }}>Property</p>
            <h1 className="text-4xl font-bold text-white">Inventory</h1>
            <p className="mt-2 font-light" style={{ color: '#A8D5DC' }}>{items.length} items tracked</p>
          </div>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
              style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
            >
              Add Item
            </button>
          )}
        </div>

        {adding && (
          <div className="rounded-2xl p-6 mb-8 space-y-5" style={{ backgroundColor: '#0D2B4E' }}>
            <h3 className="text-white font-bold text-lg">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Item Name</label>
              <input
                type="text"
                placeholder="Life jackets, kayak paddles, propane tank..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0A2342' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                  style={{ backgroundColor: '#0A2342' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                  style={{ backgroundColor: '#0A2342' }}
                >
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Location <span className="font-normal normal-case">(optional)</span></label>
              <input
                type="text"
                placeholder="Storage shed, garage, dock box..."
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0A2342' }}
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-2" style={{ color: '#A8D5DC' }}>Notes <span className="font-normal normal-case">(optional)</span></label>
              <input
                type="text"
                placeholder="Any details worth knowing..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full text-white placeholder-gray-500 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#1A7A8A] text-sm"
                style={{ backgroundColor: '#0A2342' }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!form.name}
                className="px-6 py-3 rounded-full font-semibold text-sm transition-colors disabled:opacity-40"
                style={{ backgroundColor: '#E8A838', color: '#0A2342' }}
              >
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
              <button onClick={resetForm} className="px-6 py-3 rounded-full text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {items.length === 0 && !adding && (
          <div className="text-center py-24">
            <p className="text-white font-bold text-xl mb-2">No items yet</p>
            <p className="font-light mb-8" style={{ color: '#A8D5DC' }}>Start tracking what is at your lakehouse.</p>
            <button onClick={() => setAdding(true)} className="px-6 py-3 rounded-full font-semibold text-sm transition-colors" style={{ backgroundColor: '#E8A838', color: '#0A2342' }}>
              Add First Item
            </button>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl p-5 flex items-center justify-between" style={{ backgroundColor: '#0D2B4E' }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-white font-semibold">{item.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${conditionColor(item.condition)}`}>
                    {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                  </span>
                </div>
                <p className="text-sm font-light" style={{ color: '#A8D5DC' }}>
                  Qty: {item.quantity}{item.location ? `, ${item.location}` : ''}
                </p>
                {item.notes && <p className="text-sm font-light mt-0.5" style={{ color: '#A8D5DC' }}>{item.notes}</p>}
              </div>
              <div className="flex gap-4 ml-6 shrink-0">
                <button onClick={() => handleEdit(item)} className="text-sm font-medium transition-colors hover:text-white" style={{ color: '#A8D5DC' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
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
