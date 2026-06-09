import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ArrowRight, Zap } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentCards } from '@/components/dashboard/RecentCards'
import { QuickActions } from '@/components/dashboard/QuickActions'
import type { Stat } from '@/components/dashboard/DashboardStats'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: cards } = await supabase
        .from('business_cards')
        .select('id, title, slug, is_active, template, created_at, theme_color')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const cardIds = (cards ?? []).map((c) => c.id)
    let totalViews = 0
    let totalDownloads = 0
    let totalClicks = 0

    if (cardIds.length > 0) {
        const [{ count: v }, { count: d }, { count: c }] = await Promise.all([
            supabase
                .from('analytics_events')
                .select('id', { count: 'exact', head: true })
                .in('card_id', cardIds)
                .eq('event_type', 'card_view'),
            supabase
                .from('analytics_events')
                .select('id', { count: 'exact', head: true })
                .in('card_id', cardIds)
                .eq('event_type', 'contact_download'),
            supabase
                .from('analytics_events')
                .select('id', { count: 'exact', head: true })
                .in('card_id', cardIds)
                .eq('event_type', 'link_click'),
        ])
        totalViews = v ?? 0
        totalDownloads = d ?? 0
        totalClicks = c ?? 0
    }

    const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'there'
    const activeCards = (cards ?? []).filter((c) => c.is_active).length
    const hasUsername = !!profile?.username

    const stats: Stat[] = [
        { label: 'Total Views', value: totalViews, key: 'views', change: 'All time' },
        { label: 'Cards', value: (cards ?? []).length, key: 'cards', change: `${activeCards} active` },
        { label: 'Contacts Saved', value: totalDownloads, key: 'downloads', change: 'All time' },
        { label: 'Link Clicks', value: totalClicks, key: 'clicks', change: 'All time' },
    ]

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

    return (
        <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Good {greeting}, {displayName} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {(cards ?? []).length === 0
                            ? 'Create your first digital business card to get started'
                            : `You have ${activeCards} active card${activeCards !== 1 ? 's' : ''} — here's your overview`}
                    </p>
                </div>
                <Link href="/cards/create">
                    <Button className="gap-2 shadow-sm shrink-0">
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">New card</span>
                    </Button>
                </Link>
            </div>

            {!hasUsername && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Zap className="size-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Set your username to go live</p>
                            <p className="text-xs text-muted-foreground">Your public URL will be {'{yourname}'}.cardconnect.app</p>
                        </div>
                    </div>
                    <Link href="/settings">
                        <Button size="sm" variant="outline" className="shrink-0">
                            Set username
                            <ArrowRight className="size-3 ml-1.5" />
                        </Button>
                    </Link>
                </div>
            )}

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentCards
                        cards={cards ?? []}
                        username={profile?.username ?? null}
                    />
                </div>
                <div>
                    <QuickActions
                        hasCards={(cards ?? []).length > 0}
                        username={profile?.username ?? null}
                    />
                </div>
            </div>
        </div>
    )
}
