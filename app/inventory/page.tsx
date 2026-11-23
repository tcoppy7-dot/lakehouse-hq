'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell from '../components/AppShell'
import { Card, EmptyState, Field, FormError, LoadingScreen, PageHeader, btn, inputClass } from '../components/ui'

const CONDITIONS = ['good', 'fair', 'poor', 'missing']
const CONDITION_LABEL: Record<string, string> = { good: 'Good', fair: 'Fair', poor: 'Needs replacing', missing: 'Missing' }
const conditionClass = (c: string) =>
  c === 'good' ? 'text-ink-3' : c === 'fair' ? 'text-ink-2' : 'text-danger font-medium'

const EMPTY = { name: '', quantity: '1', condition: 'good', location: '', notes: '' }

export default function Inventory() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)

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
    const { data } = await supabase.from('inventory').select('*').eq('owner_id', uid).order('name', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setForm(EMPTY)
    setAdding(false)
    setEditingId(null)
    setError(null)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    const payload = { ...form, name: form.name.trim(), quantity: parseInt(form.quantity) || 1, owner_id: user.id }
    const { error: saveError } = editingId
      ? await supabase.from('inventory').update(payload).eq('id', editingId)
      : await supabase.from('inventory').insert(payload)
    setSaving(false)
    if (saveError) {
      setError('The item was not saved. Try again in a moment.')
      return
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
      notes: item.notes || '',
    })
    setEditingId(item.id)
    setAdding(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    await supabase.from('inventory').delete().eq('id', id)
    setConfirmDelete(null)
    await loadItems(user.id)
  }

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    )
  }

  const attention = items.filter((i) => i.condition === 'poor' || i.condition === 'missing').length

  return (
    <AppShell>
      <PageHeader
        title="Inventory"
        description={
          items.length === 0
            ? 'What is at the house, so we can check before guests arrive.'
            : `${items.length} ${items.length === 1 ? 'item' : 'items'} tracked${attention ? `, ${attention} need attention` : ''}`
        }
        action={
          !adding && (
            <button onClick={() => setAdding(true)} className={btn('primary', 'md', 'w-full sm:w-auto')}>
              Add item
            </button>
          )
        }
      />

      {adding && (
        <Card className="p-5 sm:p-7 mb-8 max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
            className="space-y-6"
          >
            <h2 className="text-[19px] font-semibold">{editingId ? 'Edit item' : 'Add an item'}</h2>
            <Field label="Item" htmlFor="name">
              <input id="name" type="text" autoFocus placeholder="Life jackets, kayak paddles, propane tank" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity" htmlFor="quantity">
                <input id="quantity" type="number" inputMode="numeric" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Condition" htmlFor="condition">
                <select id="condition" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className={inputClass}>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {CONDITION_LABEL[c]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Where it is kept" htmlFor="location" optional>
              <input id="location" type="text" placeholder="Storage shed, garage, dock box" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Notes" htmlFor="notes" optional>
              <input id="notes" type="text" placeholder="Anything worth knowing" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
            </Field>
            <FormError message={error} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={resetForm} className={btn('secondary', 'md')}>
                Cancel
              </button>
              <button type="submit" disabled={!form.name.trim() || saving} className={btn('primary', 'md')}>
                {saving ? 'Saving' : editingId ? 'Save changes' : 'Add item'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 && !adding && (
        <EmptyState
          title="Nothing tracked yet"
          body="Add the things you keep at the house, like life jackets or propane, and mark anything that needs replacing."
          action={
            <button onClick={() => setAdding(true)} className={btn('primary', 'md')}>
              Add your first item
            </button>
          }
        />
      )}

      {items.length > 0 && (
        <Card>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[16px] font-medium">
                    {item.name}
                    <span className="ml-2 text-ink-3 font-normal tabular-nums">×{item.quantity}</span>
                  </p>
                  <p className="mt-0.5 text-[14px]">
                    <span className={conditionClass(item.condition)}>{CONDITION_LABEL[item.condition] ?? item.condition}</span>
                    {item.location && <span className="text-ink-2">, {item.location}</span>}
                  </p>
                  {item.notes && <p className="mt-0.5 text-[14px] text-ink-3">{item.notes}</p>}
                </div>
                <div className="flex gap-1 -ml-3 sm:ml-0 shrink-0">
                  {confirmDelete === item.id ? (
                    <>
                      <button onClick={() => handleDelete(item.id)} className={btn('danger', 'sm')}>
                        Delete {item.name}
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className={btn('quiet', 'sm')}>
                        Keep
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)} className={btn('quiet', 'sm')}>
                        Edit
                      </button>
                      <button onClick={() => setConfirmDelete(item.id)} className={btn('quiet', 'sm')}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </AppShell>
  )
}
