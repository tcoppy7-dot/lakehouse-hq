'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

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
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="text-2xl">⚓</a>
          <span className="text-white font-bold text-xl">Inventory</span>
        </div>
        <a href="/dashboard" className="text-[#5BA4CF] hover:text-white text-sm transition-colors">Dashboard</a>
      </nav>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">What is at the house</h2>
            <p className="text-[#5BA4CF] text-sm">{items.length} items tracked</p>
          </div>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="bg-[#E8A838] text-[#0A2342] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4962e] transition-colors"
            >
              Add Item
            </button>
          )}
        </div>
        {adding && (
          <div className="bg-[#1B4F8A] rounded-xl p-5 mb-6 space-y-4">
            <h3 className="text-white font-bold">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <div>
              <label className="text-[#5BA4CF] text-sm mb-1 block">Item Name</label>
              <input
                type="text"
                placeholder="Life jackets, kayak paddles, propane tank..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#5BA4CF] text-sm mb-1 block">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full bg-[#0A2342] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                />
              </div>
              <div>
                <label className="text-[#5BA4CF] text-sm mb-1 block">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full bg-[#0A2342] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                >
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[#5BA4CF] text-sm mb-1 block">Location <span className="font-normal">(optional)</span></label>
              <input
                type="text"
                placeholder="Storage shed, garage, dock box..."
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
              />
            </div>
            <div>
              <label className="text-[#5BA4CF] text-sm mb-1 block">Notes <span className="font-normal">(optional)</span></label>
              <input
                type="text"
                placeholder="Any details worth knowing..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-[#0A2342] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!form.name}
                className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors disabled:opacity-40"
              >
                {editingId ? 'Save Changes' : 'Add Item'}
              </button>
              <button onClick={resetForm} className="text-[#5BA4CF] px-6 py-3 rounded-lg hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
        {items.length === 0 && !adding && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-white font-bold text-lg">No items yet</p>
            <p className="text-[#5BA4CF] text-sm mt-1 mb-6">Start tracking what is at your lakehouse.</p>
            <button onClick={() => setAdding(true)} className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors">
              Add First Item
            </button>
          </div>
        )}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1B4F8A] rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-semibold">{item.name}</p>
                  <p className="text-[#5BA4CF] text-sm">Qty: {item.quantity}{item.location ? ` · ${item.location}` : ''}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${conditionColor(item.condition)}`}>
                  {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                </span>
              </div>
              {item.notes && <p className="text-[#5BA4CF] text-sm mb-3">{item.notes}</p>}
              <div className="flex gap-3">
                <button onClick={() => handleEdit(item)} className="text-[#5BA4CF] text-sm hover:text-white transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-400 text-sm hover:text-red-300 transition-colors">
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
