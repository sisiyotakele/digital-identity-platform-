import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { CardPublicView } from '@/components/card/CardPublicView'
import { siteConfig } from '@/config/site'

interface Props {
    params: { username: string; slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('username', params.username)
        .single()

    if (!profile) return { title: 'Not found' }

    const { data: card } = await supabase
        .from('business_cards')
        .select('title, company, bio, photo_url')
        .eq('slug', params.slug)
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .single()

    if (!card) return { title: 'Not found' }

    const title = `${card.title ?? profile.display_name} — ${card.company ?? siteConfig.name}`
    const description = card.bio ?? `${card.title ?? ''} at ${card.company ?? ''}`
    const cardUrl = `${siteConfig.url}/${params.username}/${params.slug}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: cardUrl,
            images: card.photo_url ? [{ url: card.photo_url }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: card.photo_url ? [card.photo_url] : [],
        },
    }
}

export default async function PublicCardPage({ params }: Props) {
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', params.username)
        .single()

    if (!profile) notFound()

    const { data: card } = await supabase
        .from('business_cards')
        .select('*, social_links(*), profiles(display_name, avatar_url)')
        .eq('slug', params.slug)
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .single()

    if (!card) notFound()

    return <CardPublicView card={card} username={params.username} />
}
