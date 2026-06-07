'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CreditCard, MoreVertical, Edit, Trash2, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCards } from '@/hooks/useCards'
import { siteConfig } from '@/config/site'
import { fetchCurrentProfile } from '@/lib/api/user.api'
import type { Profile } from '@/lib/types'

export default function CardsPage() {
    const { cards, loading, removeCard } = useCards()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchCurrentProfile().then(setProfile)
    }, [])

    async function confirmDelete() {
        if (!deleteId) return
        setDeleting(true)
        await removeCard(deleteId)
        setDeleting(false)
        setDeleteId(null)
    }

    const cardToDelete = cards.find((c) => c.id === deleteId)

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Cards</h1>
                    <p className="text-sm text-muted-foreground mt-1">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href="/cards/create">
                    <Button>
                        <Plus className="size-4 mr-1.5" />
                        New card
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                </div>
            ) : cards.length === 0 ? (
                <EmptyState
                    icon={CreditCard}
                    title="No cards yet"
                    description="Create your first digital business card and start sharing your identity."
                    action={{ label: 'Create your first card', onClick: () => router.push('/cards/create') }}
                />
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    <AnimatePresence>
                        {cards.map((card) => (
                            <motion.div
                                key={card.id}
                                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-medium text-sm truncate">{card.title ?? 'Untitled card'}</p>
                                                    <Badge variant={card.is_active ? 'default' : 'secondary'} className="shrink-0 text-xs">
                                                        {card.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                {card.company && <p className="text-xs text-muted-foreground mt-0.5 truncate">{card.company}</p>}
                                                <p className="text-xs text-muted-foreground mt-1 font-mono">/{card.slug}</p>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label="Card options" />
                                                    }
                                                >
                                                    <MoreVertical className="size-4" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/cards/${card.id}/edit`)}>
                                                        <Edit className="size-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {profile?.username && (
                                                        <DropdownMenuItem onClick={() => window.open(`${siteConfig.url}/${profile.username}/${card.slug}`, '_blank')}>
                                                            <ExternalLink className="size-4 mr-2" />
                                                            View live
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(card.id)}>
                                                        <Trash2 className="size-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <Link href={`/cards/${card.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Edit className="size-3.5 mr-1.5" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            {profile?.username && (
                                                <a href={`${siteConfig.url}/${profile.username}/${card.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="size-3.5" />
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete card</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-medium text-foreground">{cardToDelete?.title ?? 'this card'}</span>?
                            This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete card'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
