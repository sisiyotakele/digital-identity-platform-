import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, CreditCard, BarChart2, Eye } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: cards } = await supabase.from('business_cards').select('id, title, slug, is_active, created_at').eq('user_id', user.id)
    const cardIds = (cards ?? []).map((c) => c.id)

    let totalViews = 0
    if (cardIds.length > 0) {
        const { count } = await supabase
            .from('analytics_events')
            .select('id', { count: 'exact', head: true })
            .in('card_id', cardIds)
            .eq('event_type', 'card_view')
        totalViews = count ?? 0
    }

    const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'there'
    const activeCards = (cards ?? []).filter((c) => c.is_active).length

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-semibold">Welcome back, {displayName}</h1>
                <p className="text-sm text-muted-foreground mt-1">Here is a snapshot of your digital presence</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total cards</CardTitle>
                        <CreditCard className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(cards ?? []).length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{activeCards} active</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total views</CardTitle>
                        <Eye className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Analytics</CardTitle>
                        <BarChart2 className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            <Link href="/analytics" className="hover:underline">
                                View all
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Detailed insights</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Your cards</h2>
                    <Link href="/cards/create">
                        <Button size="sm">
                            <Plus className="size-4 mr-1.5" />
                            New card
                        </Button>
                    </Link>
                </div>

                {(cards ?? []).length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CreditCard className="size-10 text-muted-foreground mx-auto mb-3" />
                            <p className="font-medium mb-1">No cards yet</p>
                            <p className="text-sm text-muted-foreground mb-4">Create your first digital business card</p>
                            <Link href="/cards/create">
                                <Button>
                                    <Plus className="size-4 mr-1.5" />
                                    Create card
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(cards ?? []).slice(0, 6).map((card) => (
                            <Link key={card.id} href={`/cards/${card.id}/edit`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{card.title ?? 'Untitled card'}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">/{card.slug}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                                                {card.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {(cards ?? []).length > 6 && (
                    <div className="text-center">
                        <Link href="/cards">
                            <Button variant="outline" size="sm">View all cards</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
