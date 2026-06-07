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

    const lines: string[] = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${card.title ?? ''}`,
    ]

    if (card.company) lines.push(`ORG:${card.company}`)
    if (card.email) lines.push(`EMAIL:${card.email}`)
    if (card.phone) lines.push(`TEL:${card.phone}`)
    if (card.website) lines.push(`URL:${card.website}`)
    if (card.address) lines.push(`ADR:;;${card.address};;;;`)
    if (card.bio) lines.push(`NOTE:${card.bio}`)
    if (card.photo_url) lines.push(`PHOTO;VALUE=URI:${card.photo_url}`)

    for (const link of (card.social_links ?? [])) {
        lines.push(`X-SOCIALPROFILE;type=${link.platform}:${link.url}`)
    }

    lines.push(`REV:${new Date().toISOString()}`)
    lines.push('END:VCARD')

    const vcf = lines.join('\r\n')
    const filename = (card.title ?? 'contact').replace(/[^a-z0-9]/gi, '-').toLowerCase()

    return new NextResponse(vcf, {
        headers: {
            'Content-Type': 'text/vcard',
            'Content-Disposition': `attachment; filename="${filename}.vcf"`,
        },
    })
}
