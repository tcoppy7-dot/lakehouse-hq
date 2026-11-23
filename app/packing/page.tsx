'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell from '../components/AppShell'
import { Card, EmptyState, Field, FormError, LoadingScreen, PageHeader, btn, inputClass } from '../components/ui'

type DraftItem = { text: string; type: 'everyone' | 'claim' }

export default function PackingLists() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [items, setItems] = useState<DraftItem[]>([{ text: '', type: 'everyone' }])
  const [copied, setCopied] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    const { data } = await supabase.from('packing_lists').select('*').eq('owner_id', uid).order('created_at', { ascending: false })
    setLists(data || [])
    setLoading(false)
  }

  const filled = items.filter((i) => i.text.trim() !== '')

  const resetForm = () => {
    setAdding(false)
    setTitle('')
    setItems([{ text: '', type: 'everyone' }])
    setError(null)
  }

  const handleSave = async () => {
    if (!title.trim() || filled.length === 0) return
    setSaving(true)
    setError(null)
    const { error: saveError } = await supabase.from('packing_lists').insert({
      owner_id: user.id,
      title: title.trim(),
      items: filled.map((item) => ({ text: item.text.trim(), type: item.type, checked: false, claimed_by: null })),
    })
    setSaving(false)
    if (saveError) {
      setError('The list was not saved. Try again in a moment.')
      return
    }
    await loadLists(user.id)
    resetForm()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('packing_lists').delete().eq('id', id)
    setConfirmDelete(null)
    await loadLists(user.id)
  }

  const handleCopy = async (id: string) => {
    const url = window.location.origin + '/packing/' + id
    try {
      await navigator.clipboard.writeText(url)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      window.prompt('Copy this link', url)
    }
  }

  const updateItem = (index: number, patch: Partial<DraftItem>) => {
    const updated = [...items]
    updated[index] = { ...updated[index], ...patch }
    setItems(updated)
  }

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader
        title="Packing lists"
        description="Share a list with guests. They can check off what they bring and claim shared items."
        action={
          !adding && (
            <button onClick={() => setAdding(true)} className={btn('primary', 'md', 'w-full sm:w-auto')}>
              New list
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
            <h2 className="text-[19px] font-semibold">New packing list</h2>
            <Field label="List name" htmlFor="title">
              <input id="title" type="text" autoFocus placeholder="Memorial Day weekend" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
            </Field>

            <fieldset>
              <legend className="block text-[14px] font-medium mb-1">Items</legend>
              <p className="text-[13px] text-ink-3 mb-3">
                <span className="text-ink-2 font-medium">Everyone</span> is for things each guest brings, like towels.{' '}
                <span className="text-ink-2 font-medium">One person</span> is for shared things someone claims, like a cooler.
              </p>
              <ul className="space-y-2">
                {items.map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <label htmlFor={`item-${index}`} className="sr-only">
                      Item {index + 1}
                    </label>
                    <input
                      id={`item-${index}`}
                      type="text"
                      placeholder={index === 0 ? 'Sunscreen' : `Item ${index + 1}`}
                      value={item.text}
                      onChange={(e) => updateItem(index, { text: e.target.value })}
                      className={inputClass + ' flex-1 min-w-0'}
                    />
                    <label htmlFor={`type-${index}`} className="sr-only">
                      Who brings item {index + 1}
                    </label>
                    <select
                      id={`type-${index}`}
                      value={item.type}
                      onChange={(e) => updateItem(index, { type: e.target.value as DraftItem['type'] })}
                      className={inputClass + ' !w-auto shrink-0 pr-2'}
                    >
                      <option value="everyone">Everyone</option>
                      <option value="claim">One person</option>
                    </select>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== index))}
                        aria-label={`Remove item ${index + 1}`}
                        className="h-12 w-10 shrink-0 grid place-items-center rounded-xl text-ink-3 hover:text-ink hover:bg-sunk text-xl"
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setItems([...items, { text: '', type: 'everyone' }])}
                className="mt-3 text-[15px] font-medium text-lake hover:text-lake-dark"
              >
                Add another item
              </button>
            </fieldset>

            <FormError message={error} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={resetForm} className={btn('secondary', 'md')}>
                Cancel
              </button>
              <button type="submit" disabled={!title.trim() || filled.length === 0 || saving} className={btn('primary', 'md')}>
                {saving ? 'Creating' : 'Create list'}
              </button>
            </div>
            {(!title.trim() || filled.length === 0) && (
              <p className="text-[14px] text-ink-3 -mt-2">{!title.trim() ? 'Name the list to create it.' : 'Add at least one item.'}</p>
            )}
          </form>
        </Card>
      )}

      {lists.length === 0 && !adding && (
        <EmptyState
          title="No packing lists yet"
          body="Make a list for your next weekend and send guests the link. No account needed on their end."
          action={
            <button onClick={() => setAdding(true)} className={btn('primary', 'md')}>
              Make a list
            </button>
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {lists.map((list) => {
          const claims = list.items.filter((i: any) => i.type === 'claim')
          const claimed = claims.filter((i: any) => i.claimed_by).length
          return (
            <Card key={list.id} className="p-5 sm:p-6 flex flex-col">
              <p className="text-[18px] font-semibold">{list.title}</p>
              <p className="mt-0.5 text-[14px] text-ink-2">
                {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
                {claims.length > 0 && `, ${claimed} of ${claims.length} shared items claimed`}
              </p>
              <ul className="mt-4 space-y-1.5 text-[15px] text-ink-2 flex-1">
                {list.items.slice(0, 4).map((item: any, i: number) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="truncate">{item.text}</span>
                    <span className="text-[13px] text-ink-3 whitespace-nowrap">
                      {item.type === 'claim' ? item.claimed_by || 'Unclaimed' : 'Everyone'}
                    </span>
                  </li>
                ))}
                {list.items.length > 4 && <li className="text-ink-3">and {list.items.length - 4} more</li>}
              </ul>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <button onClick={() => handleCopy(list.id)} className={btn('primary', 'sm')} aria-live="polite">
                  {copied === list.id ? 'Link copied' : 'Copy guest link'}
                </button>
                <a href={'/packing/' + list.id} target="_blank" rel="noreferrer" className={btn('quiet', 'sm')}>
                  Preview
                </a>
                {confirmDelete === list.id ? (
                  <span className="ml-auto flex gap-1">
                    <button onClick={() => handleDelete(list.id)} className={btn('danger', 'sm')}>
                      Delete list
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className={btn('quiet', 'sm')}>
                      Keep
                    </button>
                  </span>
                ) : (
                  <button onClick={() => setConfirmDelete(list.id)} className={btn('quiet', 'sm', 'ml-auto')}>
                    Delete
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </AppShell>
  )
}
