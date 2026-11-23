'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AppShell from '../components/AppShell'
import Secret from '../components/Secret'
import { Card, EmptyState, Field, FormError, LoadingScreen, PageHeader, btn, inputClass, textareaClass } from '../components/ui'

const EMPTY = {
  name: '', address: '', wifi_name: '', wifi_password: '',
  access_code: '', emergency_contact: '', house_rules: '',
  boat_make: '', boat_model: '', boat_slip: '', num_jetskis: '0', watercraft_notes: '',
}

type Form = typeof EMPTY

const HOUSE_FIELDS: { key: keyof Form; label: string; placeholder: string; hint?: string }[] = [
  { key: 'name', label: 'House name', placeholder: 'The lake house' },
  { key: 'address', label: 'Address', placeholder: '123 Lake Rd' },
  { key: 'access_code', label: 'Door code', placeholder: '1234', hint: 'Hidden on screen until you tap Show.' },
  { key: 'wifi_name', label: 'WiFi network', placeholder: 'LakeHouse_5G' },
  { key: 'wifi_password', label: 'WiFi password', placeholder: 'Password' },
  { key: 'emergency_contact', label: 'Emergency contact', placeholder: 'Name and phone number' },
]

const BOAT_FIELDS: { key: keyof Form; label: string; placeholder: string }[] = [
  { key: 'boat_make', label: 'Boat make', placeholder: 'Malibu' },
  { key: 'boat_model', label: 'Boat model', placeholder: 'Wakesetter 23 LSV' },
  { key: 'boat_slip', label: 'Slip', placeholder: 'Slip 12' },
]

export default function PropertyHub() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)

  const toForm = (data: any): Form => {
    const f = { ...EMPTY }
    ;(Object.keys(EMPTY) as (keyof Form)[]).forEach((k) => {
      f[k] = data?.[k] == null ? EMPTY[k] : String(data[k])
    })
    return f
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('properties').select('*').eq('owner_id', user.id).maybeSingle()
      if (data) {
        setProperty(data)
        setForm(toForm(data))
      }
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const payload = { ...form, num_jetskis: parseInt(form.num_jetskis) || 0 }
    const { error: saveError } = property
      ? await supabase.from('properties').update(payload).eq('id', property.id)
      : await supabase.from('properties').insert({ ...payload, owner_id: user.id })
    if (saveError) {
      setError('Your changes were not saved. Try again in a moment.')
      setSaving(false)
      return
    }
    const { data } = await supabase.from('properties').select('*').eq('owner_id', user.id).maybeSingle()
    setProperty(data)
    setForm(toForm(data))
    setSaving(false)
    setEditing(false)
    window.scrollTo({ top: 0 })
  }

  const cancel = () => {
    setForm(toForm(property))
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    )
  }

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [key]: e.target.value })

  return (
    <AppShell>
      {!property && !editing && (
        <>
          <PageHeader title="House" />
          <EmptyState
            title="Add your house details"
            body="The address, door code, WiFi, and boat info you and our team need, all in one place."
            action={
              <button onClick={() => setEditing(true)} className={btn('primary', 'md')}>
                Add house details
              </button>
            }
          />
        </>
      )}

      {editing && (
        <form
          className="max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <PageHeader title={property ? 'Edit house details' : 'Add house details'} description="Only you and our service team can see these." />

          <fieldset className="space-y-6">
            <legend className="text-[17px] font-semibold mb-4">House</legend>
            {HOUSE_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} htmlFor={f.key} hint={f.hint}>
                <input id={f.key} type="text" placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} className={inputClass} autoComplete="off" />
              </Field>
            ))}
            <Field label="House rules" htmlFor="house_rules" optional>
              <textarea id="house_rules" rows={4} placeholder="Shoes off inside, quiet after 10 PM" value={form.house_rules} onChange={set('house_rules')} className={textareaClass} />
            </Field>
          </fieldset>

          <fieldset className="space-y-6 mt-12">
            <legend className="text-[17px] font-semibold mb-4">Boat and watercraft</legend>
            <div className="grid gap-6 sm:grid-cols-2">
              {BOAT_FIELDS.map((f) => (
                <Field key={f.key} label={f.label} htmlFor={f.key}>
                  <input id={f.key} type="text" placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} className={inputClass} />
                </Field>
              ))}
              <Field label="Jet skis" htmlFor="num_jetskis">
                <input id="num_jetskis" type="number" inputMode="numeric" min="0" value={form.num_jetskis} onChange={set('num_jetskis')} className={inputClass} />
              </Field>
            </div>
            <Field label="Watercraft notes" htmlFor="watercraft_notes" optional>
              <textarea id="watercraft_notes" rows={3} placeholder="Boat cover is in the storage shed" value={form.watercraft_notes} onChange={set('watercraft_notes')} className={textareaClass} />
            </Field>
          </fieldset>

          <div className="mt-10 space-y-4">
            <FormError message={error} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={cancel} className={btn('secondary', 'lg')}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={btn('primary', 'lg')}>
                {saving ? 'Saving' : 'Save details'}
              </button>
            </div>
          </div>
        </form>
      )}

      {property && !editing && (
        <>
          <PageHeader
            title={property.name || 'House'}
            description={property.address || undefined}
            action={
              <button onClick={() => setEditing(true)} className={btn('secondary', 'md', 'w-full sm:w-auto')}>
                Edit details
              </button>
            }
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="text-[17px] font-semibold mb-3">Getting in</h2>
              <Card>
                <dl className="divide-y divide-line text-[15px]">
                  <Item label="Door code">
                    <Secret value={property.access_code} label="door code" />
                  </Item>
                  <Item label="WiFi network">{property.wifi_name}</Item>
                  <Item label="WiFi password">
                    <Secret value={property.wifi_password} label="WiFi password" />
                  </Item>
                  <Item label="Emergency contact">{property.emergency_contact}</Item>
                </dl>
              </Card>
              {property.house_rules && (
                <>
                  <h2 className="text-[17px] font-semibold mt-8 mb-3">House rules</h2>
                  <Card className="px-5 py-4">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{property.house_rules}</p>
                  </Card>
                </>
              )}
            </section>

            <section>
              <h2 className="text-[17px] font-semibold mb-3">Boat and watercraft</h2>
              <Card>
                <dl className="divide-y divide-line text-[15px]">
                  <Item label="Boat">{[property.boat_make, property.boat_model].filter(Boolean).join(' ')}</Item>
                  <Item label="Slip">{property.boat_slip}</Item>
                  <Item label="Jet skis">{String(property.num_jetskis ?? 0)}</Item>
                </dl>
              </Card>
              {property.watercraft_notes && (
                <>
                  <h2 className="text-[17px] font-semibold mt-8 mb-3">Watercraft notes</h2>
                  <Card className="px-5 py-4">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{property.watercraft_notes}</p>
                  </Card>
                </>
              )}
            </section>
          </div>
        </>
      )}
    </AppShell>
  )
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  const empty = children === '' || children == null
  return (
    <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-[13px] text-ink-3 sm:text-[15px] sm:text-ink-2 shrink-0">{label}</dt>
      <dd className="sm:text-right">{empty ? <span className="text-ink-3">Not set</span> : children}</dd>
    </div>
  )
}
