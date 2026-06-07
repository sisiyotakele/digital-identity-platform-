import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
    name: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#111827' },
    company: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    section: { marginTop: 16 },
    label: {
        fontSize: 8,
        color: '#9CA3AF',
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    value: { fontSize: 11, color: '#374151' },
    bio: { fontSize: 11, color: '#6B7280', lineHeight: 1.5 },
    divider: { borderBottom: '1 solid #E5E7EB', marginVertical: 16 },
})

interface CardData {
    title: string | null
    company: string | null
    bio: string | null
    email: string | null
    phone: string | null
    website: string | null
    address: string | null
}

function CardPDF({ card }: { card: CardData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.name}>{card.title ?? ''}</Text>
                {card.company ? <Text style={styles.company}>{card.company}</Text> : null}

                <View style={styles.divider} />

                {card.bio ? (
                    <View style={styles.section}>
                        <Text style={styles.bio}>{card.bio}</Text>
                    </View>
                ) : null}

                {card.email ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{card.email}</Text>
                    </View>
                ) : null}

                {card.phone ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.value}>{card.phone}</Text>
                    </View>
                ) : null}

                {card.website ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Website</Text>
                        <Text style={styles.value}>{card.website}</Text>
                    </View>
                ) : null}

                {card.address ? (
                    <View style={styles.section}>
                        <Text style={styles.label}>Address</Text>
                        <Text style={styles.value}>{card.address}</Text>
                    </View>
                ) : null}
            </Page>
        </Document>
    )
}

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

    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { data: card } = await supabase
        .from('business_cards')
        .select('title, company, bio, email, phone, website, address')
        .eq('slug', slug)
        .eq('user_id', profile.id)
        .single()

    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

    const buffer = await renderToBuffer(<CardPDF card={card} />)
    const filename = (card.title ?? 'card').replace(/[^a-z0-9]/gi, '-').toLowerCase()

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        },
    })
}
