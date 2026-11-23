import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabase'

// Pinged daily by a Vercel Cron Job (see vercel.json) so the free Supabase
// project never goes idle long enough to be paused.
export const dynamic = 'force-dynamic'

export async function GET() {
  const { error } = await supabase.from('profiles').select('id', { head: true, count: 'exact' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
