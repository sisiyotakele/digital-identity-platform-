import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const slug = searchParams.get('slug')
    const username = searchParams.get('username')
    // Allow a direct URL override for when username isn't available
    const directUrl = searchParams.get('url')

    if (!slug && !directUrl) {
        return NextResponse.json({ error: 'slug or url is required' }, { status: 400 })
    }

    // Build the card URL
    let cardUrl: string
    if (directUrl) {
        cardUrl = directUrl
    } else if (username && slug) {
        cardUrl = `${siteConfig.url}/${username}/${slug}`
    } else {
        cardUrl = `${siteConfig.url}/${slug}`
    }

    // Record the QR scan in the database (best effort — don't fail if this errors)
    try {
        const supabase = await createServerSupabaseClient()
        const { data: card } = await supabase
            .from('business_cards')
            .select('id')
            .eq('slug', slug ?? '')
            .maybeSingle()

        if (card) {
            await supabase.from('qr_codes').insert({ card_id: card.id })
        }
    } catch {
        // Non-critical — don't fail the QR generation
    }

    const pngBuffer = await QRCode.toBuffer(cardUrl, {
        type: 'png',
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#FFFFFF' },
    })

    const safeFilename = (slug ?? 'qrcode').replace(/[^a-zA-Z0-9-]/g, '-')

    return new NextResponse(new Uint8Array(pngBuffer), {
        headers: {
            'Content-Type': 'image/png',
            'Content-Disposition': `attachment; filename="${safeFilename}-qr.png"`,
            'Cache-Control': 'public, max-age=3600',
        },
    })
}
