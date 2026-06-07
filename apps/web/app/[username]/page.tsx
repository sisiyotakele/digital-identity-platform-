import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import { getInitials } from '@/lib/constants'

interface Props {
    params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = await createServerSupabaseClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('username', params.username)
        .single()

    if (!profile) return { title: 'Not found' }

    const name = profile.display_name ?? params.username
    return {
        title: `${name} on ${siteConfig.name}`,
        description: `View all digital business cards from ${name}`,
        openGraph: {
            title: `${name} on ${siteConfig.name}`,
            images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
        },
    }
}

export default async function UserProfilePage({ params }: Props) {
    const supabase = await createServerSupabaseClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single()

    if (!profile) notFound()

    const { data: cards } = await supabase
        .from('business_cards')
        .select('id, slug, title, company, template, is_active')
        .eq('user_id', profile.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    const displayName = profile.display_name ?? params.username
    const initials = getInitials(displayName)

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
                <div className="text-center space-y-3">
                    <Avatar size="lg" className="mx-auto size-20">
                        {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-semibold">{displayName}</h1>
                        <p className="text-sm text-muted-foreground">@{params.username}</p>
                    </div>
                </div>

                {(cards ?? []).length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No cards published yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-center">
                            {(cards ?? []).length} card{(cards ?? []).length !== 1 ? 's' : ''}
                        </p>
                        {(cards ?? []).map((card) => (
                            <Link
                                key={card.id}
                                href={`/${params.username}/${card.slug}`}
                                className="block bg-white rounded-xl border border-border p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-sm">{card.title ?? 'Card'}</p>
                                        {card.company && <p className="text-xs text-muted-foreground mt-0.5">{card.company}</p>}
                                    </div>
                                    <Badge variant="outline" className="text-xs capitalize">{card.template}</Badge>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Powered by{' '}
                    <Link href="/" className="hover:underline">{siteConfig.name}</Link>
                </p>
            </div>
        </div>
    )
}
