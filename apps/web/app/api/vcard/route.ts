import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl
    const slug = searchParams.get('slug')
    const username = searchParams.get('username')

    if (!slug || !username) {
        return NextResponse.json({ error: 'slug and username are required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (!profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: card } = await supabase
        .from('business_cards')
        .select('*, social_links(*)')
        .eq('slug', slug)
        .eq('user_id', profile.id)
        .single()

    if (!card) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    // Build vCard 3.0 — all values UTF-8 safe
    const lines: string[] = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${sanitizeVCardField(card.title ?? '')}`,
        `N:${sanitizeVCardField(card.title?.split(' ').slice(1).join(' ') ?? '')};${sanitizeVCardField(card.title?.split(' ')[0] ?? '')};;;`,
    ]

    if (card.company) {
        lines.push(`ORG:${sanitizeVCardField(card.company)}`)
    }
    if (card.email) {
        lines.push(`EMAIL;TYPE=INTERNET:${card.email}`)
    }
    if (card.phone) {
        lines.push(`TEL;TYPE=CELL:${card.phone}`)
    }
    if (card.website) {
        lines.push(`URL:${card.website}`)
    }
    if (card.address) {
        lines.push(`ADR;TYPE=WORK:;;${sanitizeVCardField(card.address)};;;;`)
    }
    if (card.bio) {
        lines.push(`NOTE:${sanitizeVCardField(card.bio)}`)
    }
    if (card.photo_url) {
        lines.push(`PHOTO;VALUE=URI:${card.photo_url}`)
    }

    for (const link of (card.social_links ?? [])) {
        lines.push(`X-SOCIALPROFILE;TYPE=${link.platform}:${link.url}`)
    }

    lines.push(`REV:${new Date().toISOString()}`)
    lines.push('END:VCARD')

    const vcf = lines.join('\r\n')

    // Safe ASCII filename for Content-Disposition
    const safeFilename = (card.title ?? 'contact')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove diacritics
        .replace(/[^a-zA-Z0-9\s-]/g, '') // remove non-ASCII
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase() || 'contact'

    return new NextResponse(vcf, {
        headers: {
            'Content-Type': 'text/vcard; charset=utf-8',
            'Content-Disposition': `attachment; filename="${safeFilename}.vcf"`,
            'Cache-Control': 'no-cache',
        },
    })
}

function sanitizeVCardField(value: string): string {
    // Escape special vCard characters: comma, semicolon, backslash, newline
    return value
        .replace(/\\/g, '\\\\')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '')
}
