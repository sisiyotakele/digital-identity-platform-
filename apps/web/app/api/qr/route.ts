import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const slug = searchParams.get('slug')
    const username = searchParams.get('username')

    if (!slug || !username) {
        return NextResponse.json({ error: 'slug and username are required' }, { status: 400 })
    }

    const cardUrl = `${siteConfig.url}/${username}/${slug}`

    const supabase = await createServerSupabaseClient()
    const { data: card } = await supabase
        .from('business_cards')
        .select('id')
        .eq('slug', slug)
        .single()

    if (card) {
        await supabase.from('qr_codes').insert({ card_id: card.id })
    }

    const pngBuffer = await QRCode.toBuffer(cardUrl, {
        type: 'png',
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
    })

    return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=3600',
        },
    })
}
