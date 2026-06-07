import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const body = await request.json() as {
        card_id: string
        event_type: string
        device_type?: string
        link_platform?: string
    }

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('analytics_events').insert({
        card_id: body.card_id,
        event_type: body.event_type,
        device_type: body.device_type ?? null,
        link_platform: body.link_platform ?? null,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
