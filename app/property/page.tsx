'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function PropertyHub() {
  const [user, setUser] = useState<any>(null)
  const [property, setProperty] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', address: '', wifi_name: '', wifi_password: '',
    access_code: '', emergency_contact: '', house_rules: '',
    boat_make: '', boat_model: '', boat_slip: '', num_jetskis: '0', watercraft_notes: ''
  })
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .single()
      if (data) {
        setProperty(data)
        setForm({ ...data, num_jetskis: String(data.num_jetskis ?? '0') })
      }
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    const payload = { ...form, num_jetskis: parseInt(form.num_jetskis) || 0 }
    if (property) {
      await supabase.from('properties').update(payload).eq('id', property.id)
    } else {
      await supabase.from('properties').insert({ ...payload, owner_id: user.id })
    }
    const { data } = await supabase.from('properties').select('*').eq('owner_id', user.id).single()
    setProperty(data)
    setForm({ ...data, num_jetskis: String(data.num_jetskis ?? '0') })
    setEditing(false)
  }

  if (loading) return <div className="min-h-screen bg-[#0A2342] flex items-center justify-center"><p className="text-white">Loading...</p></div>

  return (
    <main className="min-h-screen bg-[#0A2342]">
      <nav className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="text-2xl">⚓</a>
          <span className="text-white font-bold text-xl">Property Hub</span>
        </div>
        <a href="/dashboard" className="text-[#5BA4CF] hover:text-white text-sm transition-colors">Dashboard</a>
      </nav>
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {!property && !editing && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏡</div>
            <h2 className="text-white text-xl font-bold mb-2">No property yet</h2>
            <p className="text-[#5BA4CF] mb-6">Add your lakehouse details to get started.</p>
            <button onClick={() => setEditing(true)} className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors">
              Add Property
            </button>
          </div>
        )}
        {editing && (
          <div className="space-y-6">
            <h2 className="text-white text-xl font-bold">Property Details</h2>
            <div className="space-y-4">
              <p className="text-[#E8A838] text-sm font-semibold uppercase tracking-wider">House Info</p>
              {[
                { key: 'name', label: 'Property Name', placeholder: 'Lake House' },
                { key: 'address', label: 'Address', placeholder: '123 Lake Rd' },
                { key: 'wifi_name', label: 'WiFi Network', placeholder: 'LakeHouse_5G' },
                { key: 'wifi_password', label: 'WiFi Password', placeholder: 'password123' },
                { key: 'access_code', label: 'Access Code', placeholder: '1234' },
                { key: 'emergency_contact', label: 'Emergency Contact', placeholder: 'John: 555-1234' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[#5BA4CF] text-sm mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-[#1B4F8A] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                  />
                </div>
              ))}
              <div>
                <label className="text-[#5BA4CF] text-sm mb-1 block">House Rules</label>
                <textarea
                  placeholder="No shoes inside, quiet hours after 10pm..."
                  value={form.house_rules}
                  onChange={(e) => setForm({ ...form, house_rules: e.target.value })}
                  rows={4}
                  className="w-full bg-[#1B4F8A] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[#E8A838] text-sm font-semibold uppercase tracking-wider">Boat and Watercraft</p>
              {[
                { key: 'boat_make', label: 'Boat Make', placeholder: 'Malibu' },
                { key: 'boat_model', label: 'Boat Model', placeholder: 'Wakesetter 23 LSV' },
                { key: 'boat_slip', label: 'Boat Slip Number', placeholder: 'Slip 12' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-[#5BA4CF] text-sm mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-[#1B4F8A] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                  />
                </div>
              ))}
              <div>
                <label className="text-[#5BA4CF] text-sm mb-1 block">Number of Jet Skis</label>
                <input
                  type="number"
                  min="0"
                  value={form.num_jetskis}
                  onChange={(e) => setForm({ ...form, num_jetskis: e.target.value })}
                  className="w-full bg-[#1B4F8A] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                />
              </div>
              <div>
                <label className="text-[#5BA4CF] text-sm mb-1 block">Watercraft Notes</label>
                <textarea
                  placeholder="Boat cover is in the storage shed..."
                  value={form.watercraft_notes}
                  onChange={(e) => setForm({ ...form, watercraft_notes: e.target.value })}
                  rows={3}
                  className="w-full bg-[#1B4F8A] text-white placeholder-[#5BA4CF] px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#1A7A8A]"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="bg-[#E8A838] text-[#0A2342] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4962e] transition-colors">
                Save Property
              </button>
              <button onClick={() => setEditing(false)} className="text-[#5BA4CF] px-6 py-3 rounded-lg hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}
        {property && !editing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-2xl font-bold">{property.name}</h2>
              <button onClick={() => setEditing(true)} className="bg-[#1A7A8A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#065A82] transition-colors">
                Edit
              </button>
            </div>
            <div className="space-y-3">
              <p className="text-[#E8A838] text-sm font-semibold uppercase tracking-wider">House Info</p>
              {[
                { label: 'Address', value: property.address, icon: '📍' },
                { label: 'WiFi Network', value: property.wifi_name, icon: '📶' },
                { label: 'WiFi Password', value: property.wifi_password, icon: '🔑' },
                { label: 'Access Code', value: property.access_code, icon: '🔐' },
                { label: 'Emergency Contact', value: property.emergency_contact, icon: '📞' },
              ].map(item => (
                <div key={item.label} className="bg-[#1B4F8A] rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-[#5BA4CF] text-xs mb-1">{item.label}</p>
                    <p className="text-white">{item.value || 'Not set'}</p>
                  </div>
                </div>
              ))}
              {property.house_rules && (
                <div className="bg-[#1B4F8A] rounded-xl p-4">
                  <p className="text-[#5BA4CF] text-xs mb-2">📋 House Rules</p>
                  <p className="text-white whitespace-pre-wrap">{property.house_rules}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-[#E8A838] text-sm font-semibold uppercase tracking-wider">Boat and Watercraft</p>
              {[
                { label: 'Boat Make', value: property.boat_make, icon: '🚤' },
                { label: 'Boat Model', value: property.boat_model, icon: '🚤' },
                { label: 'Boat Slip', value: property.boat_slip, icon: '⚓' },
                { label: 'Jet Skis', value: String(property.num_jetskis ?? 0), icon: '🏄' },
              ].map(item => (
                <div key={item.label} className="bg-[#1B4F8A] rounded-xl p-4 flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-[#5BA4CF] text-xs mb-1">{item.label}</p>
                    <p className="text-white">{item.value || 'Not set'}</p>
                  </div>
                </div>
              ))}
              {property.watercraft_notes && (
                <div className="bg-[#1B4F8A] rounded-xl p-4">
                  <p className="text-[#5BA4CF] text-xs mb-2">📝 Watercraft Notes</p>
                  <p className="text-white whitespace-pre-wrap">{property.watercraft_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
