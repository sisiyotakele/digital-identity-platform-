'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit, ExternalLink, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

interface CardRow {
    id: string
    title: string | null
    slug: string
    is_active: boolean
    template: string
    theme_color: string | null
}

const templateColors: Record<string, string> = {
    minimal: '#6B7280',
    modern: '#3B82F6',
    corporate: '#1B4F8A',
    creative: '#7C3AED',
    executive: '#92400E',
    dark: '#22D3EE',
    gradient: '#6366F1',
    startup: '#10B981',
}

export function RecentCards({
    cards,
    username,
}: {
    cards: CardRow[]
    username: string | null
}) {
    if (cards.length === 0) {
        return (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="size-7 text-muted-foreground" />
                </div>
                <p className="font-semibold mb-1">No cards yet</p>
                <p className="text-sm text-muted-foreground mb-5">
                    Create your first digital business card and start sharing your identity.
                </p>
                <Link href="/cards/create">
                    <Button>
                        <Plus className="size-4 mr-2" />
                        Create your first card
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-sm">Your Cards</h2>
                <Link href="/cards">
                    <Button variant="ghost" size="sm" className="text-xs">
                        View all
                        <ExternalLink className="size-3 ml-1.5" />
                    </Button>
                </Link>
            </div>

            <div className="divide-y divide-border">
                {cards.slice(0, 5).map((card, i) => {
                    const color = card.theme_color ?? templateColors[card.template] ?? '#6B7280'
                    return (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors group"
                        >
                            <div
                                className="size-9 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                                style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}
                            >
                                {(card.title ?? 'C').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{card.title ?? 'Untitled card'}</p>
                                <p className="text-xs text-muted-foreground truncate">/{card.slug} · {card.template}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${card.is_active
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {card.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/cards/${card.id}/edit`}>
                                        <Button variant="ghost" size="icon-sm">
                                            <Edit className="size-3.5" />
                                        </Button>
                                    </Link>
                                    {username && (
                                        <a
                                            href={`${siteConfig.url}/${username}/${card.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="ghost" size="icon-sm">
                                                <ExternalLink className="size-3.5" />
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {cards.length > 5 && (
                <div className="px-5 py-3 border-t border-border text-center">
                    <Link href="/cards">
                        <Button variant="ghost" size="sm" className="text-xs w-full">
                            +{cards.length - 5} more cards
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
