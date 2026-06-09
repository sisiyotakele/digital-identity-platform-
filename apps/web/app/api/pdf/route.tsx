import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { renderToBuffer, Document, Page, View, Text, StyleSheet, Svg, Path } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        padding: 0,
    },
    // Top accent bar
    header: {
        height: 8,
        backgroundColor: '#3B82F6',
    },
    body: {
        padding: '32 40 40 40',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    nameBlock: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: '#111827',
        lineHeight: 1.2,
    },
    title: {
        fontSize: 12,
        color: '#3B82F6',
        marginTop: 3,
        fontFamily: 'Helvetica-Bold',
    },
    company: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 16,
    },
    bioText: {
        fontSize: 10,
        color: '#6B7280',
        lineHeight: 1.6,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0,
    },
    fieldBlock: {
        width: '50%',
        marginBottom: 14,
        paddingRight: 12,
    },
    fieldLabel: {
        fontSize: 7,
        color: '#9CA3AF',
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#D1D5DB',
        fontFamily: 'Helvetica-Bold',
        letterSpacing: 1,
    },
    footerUrl: {
        fontSize: 8,
        color: '#9CA3AF',
    },
    accentBar: {
        height: 3,
        backgroundColor: '#3B82F6',
        marginBottom: 16,
        borderRadius: 2,
        width: 40,
    },
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

function CardPDF({ card, cardUrl }: { card: CardData; cardUrl: string }) {
    return (
        <Document
            title={card.title ?? 'Business Card'}
            author="UNIQUE Digital Card"
            subject="Digital Business Card"
        >
            <Page size="A4" style={styles.page}>
                {/* Top accent */}
                <View style={styles.header} />

                <View style={styles.body}>
                    {/* Name block */}
                    <View style={styles.nameRow}>
                        <View style={styles.nameBlock}>
                            <View style={styles.accentBar} />
                            <Text style={styles.name}>{card.title ?? ''}</Text>
                            {card.company ? <Text style={styles.company}>{card.company}</Text> : null}
                        </View>
                    </View>

                    {card.bio ? <Text style={styles.bioText}>{card.bio}</Text> : null}

                    <View style={styles.divider} />

                    {/* Contact grid */}
                    <View style={styles.grid}>
                        {card.email ? (
                            <View style={styles.fieldBlock}>
                                <Text style={styles.fieldLabel}>Email</Text>
                                <Text style={styles.fieldValue}>{card.email}</Text>
                            </View>
                        ) : null}

                        {card.phone ? (
                            <View style={styles.fieldBlock}>
                                <Text style={styles.fieldLabel}>Phone</Text>
                                <Text style={styles.fieldValue}>{card.phone}</Text>
                            </View>
                        ) : null}

                        {card.website ? (
                            <View style={styles.fieldBlock}>
                                <Text style={styles.fieldLabel}>Website</Text>
                                <Text style={styles.fieldValue}>{card.website}</Text>
                            </View>
                        ) : null}

                        {card.address ? (
                            <View style={styles.fieldBlock}>
                                <Text style={styles.fieldLabel}>Location</Text>
                                <Text style={styles.fieldValue}>{card.address}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.divider} />

                    {/* Card URL */}
                    <View style={styles.fieldBlock}>
                        <Text style={styles.fieldLabel}>Digital Card</Text>
                        <Text style={styles.fieldValue}>{cardUrl}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>UNIQUE DIGITAL CARD</Text>
                    <Text style={styles.footerUrl}>unique.digital</Text>
                </View>
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

    const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/${username}/${slug}`

    const buffer = await renderToBuffer(<CardPDF card={card} cardUrl={cardUrl} />)

    // Safe ASCII filename
    const safeFilename = (card.title ?? 'card')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase() || 'business-card'

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${safeFilename}.pdf"`,
            'Cache-Control': 'no-cache',
        },
    })
}
