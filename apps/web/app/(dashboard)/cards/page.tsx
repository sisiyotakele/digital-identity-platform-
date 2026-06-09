'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, CreditCard, MoreVertical, Edit, Trash2, Eye,
    ExternalLink, Copy, QrCode, Search, Printer, Share2,
    Zap, TrendingUp, Check, X
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import { useCards } from '@/hooks/useCards'
import { siteConfig } from '@/config/site'
import { fetchCurrentProfile } from '@/lib/api/user.api'
import { updateCard } from '@/lib/api/card.api'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTERS = ['All', 'Active', 'Inactive'] as const
type Filter = typeof FILTERS[number]

const TEMPLATE_META: Record<string, { gradient: string; accent: string; label: string }> = {
    minimal: { gradient: 'from-slate-400 via-slate-500 to-slate-700', accent: '#64748B', label: 'Minimal' },
    modern: { gradient: 'from-blue-500 via-blue-600 to-blue-800', accent: '#3B82F6', label: 'Modern' },
    corporate: { gradient: 'from-blue-800 via-blue-900 to-indigo-950', accent: '#1E40AF', label: 'Corporate' },
    creative: { gradient: 'from-violet-500 via-purple-600 to-pink-600', accent: '#7C3AED', label: 'Creative' },
    executive: { gradient: 'from-stone-600 via-stone-800 to-stone-950', accent: '#78716C', label: 'Executive' },
    dark: { gradient: 'from-zinc-700 via-zinc-800 to-zinc-950', accent: '#22D3EE', label: 'Dark' },
    gradient: { gradient: 'from-indigo-500 via-violet-600 to-purple-700', accent: '#6366F1', label: 'Gradient' },
    startup: { gradient: 'from-emerald-500 via-teal-600 to-emerald-700', accent: '#10B981', label: 'Startup' },
}

export default function CardsPage() {
    const { cards, loading, removeCard, refresh } = useCards()
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [filter, setFilter] = useState<Filter>('All')
    const [search, setSearch] = useState('')
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const router = useRouter()

    useEffect(() => { fetchCurrentProfile().then(setProfile) }, [])

    async function confirmDelete() {
        if (!deleteId) return
        setDeleting(true)
        await removeCard(deleteId)
        setDeleting(false)
        setDeleteId(null)
    }

    async function handleDuplicate(id: string) {
        const card = cards.find((c) => c.id === id)
        if (!card) return
        try {
            const { createCard } = await import('@/lib/api/card.api')
            await createCard({
                slug: `${card.slug}-copy-${Date.now().toString(36)}`,
                template: card.template,
                title: `${card.title ?? ''} (copy)`,
                company: card.company ?? '',
                phone: card.phone ?? '',
                email: card.email ?? '',
                website: card.website ?? '',
                bio: card.bio ?? '',
                theme_color: card.theme_color,
            })
            toast.success('Card duplicated')
            refresh()
        } catch { toast.error('Failed to duplicate') }
    }

    async function handleToggleActive(id: string, current: boolean) {
        try {
            await updateCard(id, { is_active: !current })
            toast.success(current ? 'Card deactivated' : 'Card activated')
            refresh()
        } catch { toast.error('Failed to update') }
    }

    function handleCopyLink(slug: string) {
        if (!profile?.username) { toast.error('Set your username in Settings first'); return }
        navigator.clipboard.writeText(`${siteConfig.url}/${profile.username}/${slug}`)
        toast.success('Link copied to clipboard')
    }

    const filtered = cards.filter((c) => {
        const matchFilter = filter === 'All' || (filter === 'Active' ? c.is_active : !c.is_active)
        const matchSearch = !search ||
            (c.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
            c.slug.toLowerCase().includes(search.toLowerCase()) ||
            (c.company ?? '').toLowerCase().includes(search.toLowerCase())
        return matchFilter && matchSearch
    })

    const active = cards.filter((c) => c.is_active).length
    const inactive = cards.length - active
    const cardToDelete = cards.find((c) => c.id === deleteId)

    return (
        <div className="min-h-screen bg-background">
            {/* ── Page header with stats bar ────────────────────────────── */}
            <div className="border-b border-border bg-card">
                <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">My Cards</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Manage, share and print your digital business cards
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link href="/print">
                                <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
                                    <Printer className="size-3.5" />
                                    <span className="hidden sm:inline">Print</span>
                                </Button>
                            </Link>
                            <Link href="/cards/create">
                                <Button
                                    size="sm"
                                    className="gap-1.5 font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 shadow-md shadow-blue-500/20"
                                >
                                    <Plus className="size-3.5" />
                                    <span className="hidden sm:inline">New card</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stat pills */}
                    {!loading && cards.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: 'Total', value: cards.length, icon: CreditCard, color: 'text-blue-500 bg-blue-500/10' },
                                { label: 'Live', value: active, icon: Zap, color: 'text-emerald-500 bg-emerald-500/10' },
                                { label: 'Draft', value: inactive, icon: TrendingUp, color: 'text-amber-500 bg-amber-500/10' },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-semibold">
                                    <div className={`size-5 rounded-full flex items-center justify-center ${s.color}`}>
                                        <s.icon className="size-3" />
                                    </div>
                                    <span className="text-foreground">{s.value}</span>
                                    <span className="text-muted-foreground font-normal">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main content ───────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-6 space-y-5">

                {/* Toolbar: search + filter + view toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, company…"
                            className="pl-8 h-9 text-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-1 bg-muted p-1 rounded-lg shrink-0">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    'px-3 py-1 rounded-md text-xs font-bold transition-all',
                                    filter === f
                                        ? 'bg-card shadow-sm text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Grid / List toggle */}
                    <div className="hidden sm:flex gap-1 bg-muted p-1 rounded-lg ml-auto shrink-0">
                        {(['grid', 'list'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={cn(
                                    'px-3 py-1 rounded-md text-xs font-bold transition-all capitalize',
                                    view === v ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Loading skeletons ────── */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-64 rounded-2xl" />
                        ))}
                    </div>
                )}

                {/* ── Empty state ───────────── */}
                {!loading && filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 text-center"
                    >
                        <div className="relative mb-6">
                            <div className="size-24 rounded-3xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center">
                                <CreditCard className="size-10 text-blue-400" />
                            </div>
                            <div className="absolute -top-2 -right-2 size-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg">
                                <Plus className="size-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-black mb-2">
                            {cards.length === 0 ? 'Create your first card' : 'No cards match'}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs mb-8">
                            {cards.length === 0
                                ? 'Design a stunning digital business card in under 2 minutes.'
                                : 'Try adjusting your search or filter.'}
                        </p>
                        {cards.length === 0 && (
                            <Link href="/cards/create">
                                <Button className="gap-2 font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 shadow-lg shadow-blue-500/20 px-6 h-11">
                                    <Plus className="size-4" />
                                    Create your first card
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* ── Card grid ─────────────── */}
                {!loading && filtered.length > 0 && view === 'grid' && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                        <AnimatePresence>
                            {filtered.map((card) => {
                                const meta = TEMPLATE_META[card.template] ?? TEMPLATE_META.modern
                                const initials = (card.title ?? 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

                                return (
                                    <motion.div
                                        key={card.id}
                                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                                        exit={{ opacity: 0, scale: 0.94 }}
                                        layout
                                        whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                                        className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-shadow"
                                    >
                                        {/* ── Card face (top 40%) ── */}
                                        <div
                                            className={`relative h-40 bg-gradient-to-br ${meta.gradient} cursor-pointer overflow-hidden`}
                                            onClick={() => router.push(`/cards/${card.id}/edit`)}
                                        >
                                            {/* Shimmer overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />

                                            {/* Decorative circles */}
                                            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/5 border border-white/10" />
                                            <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-black/10" />

                                            {/* UNIQUE watermark */}
                                            <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-sm rounded-lg px-2 py-0.5">
                                                <span className="text-white text-[9px] font-black tracking-[0.15em]">UNIQUE</span>
                                            </div>

                                            {/* Template label */}
                                            <div className="absolute top-3 left-3">
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">{meta.label}</span>
                                            </div>

                                            {/* Avatar + name */}
                                            <div className="absolute bottom-4 left-4 flex items-end gap-3">
                                                <div className="size-11 rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30 flex items-center justify-center shadow-lg overflow-hidden">
                                                    {card.photo_url ? (
                                                        <img src={card.photo_url} alt={card.title ?? ''} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-black text-white">{initials}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white leading-tight drop-shadow">
                                                        {card.title ?? 'Untitled'}
                                                    </p>
                                                    {card.company && (
                                                        <p className="text-[11px] text-white/70 leading-tight">{card.company}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status pill */}
                                            <div className={cn(
                                                'absolute bottom-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold',
                                                card.is_active
                                                    ? 'bg-emerald-400/25 text-emerald-300 border border-emerald-400/30'
                                                    : 'bg-white/10 text-white/50 border border-white/20'
                                            )}>
                                                <span className={cn('size-1.5 rounded-full', card.is_active ? 'bg-emerald-400' : 'bg-white/40')} />
                                                {card.is_active ? 'Live' : 'Draft'}
                                            </div>

                                            {/* Hover overlay with quick-view */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="flex gap-2">
                                                    <div className="size-9 rounded-xl bg-white/90 flex items-center justify-center shadow">
                                                        <Edit className="size-4 text-gray-700" />
                                                    </div>
                                                    {profile?.username && (
                                                        <a
                                                            href={`${siteConfig.url}/${profile.username}/${card.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="size-9 rounded-xl bg-white/90 flex items-center justify-center shadow">
                                                                <Eye className="size-4 text-gray-700" />
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Card body (bottom 60%) ── */}
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-foreground truncate">
                                                        {card.title ?? 'Untitled card'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                                                        /{card.slug}
                                                    </p>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="shrink-0 -mr-1 opacity-60 group-hover:opacity-100 transition-opacity"
                                                                aria-label="Card options"
                                                            />
                                                        }
                                                    >
                                                        <MoreVertical className="size-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem onClick={() => router.push(`/cards/${card.id}/edit`)}>
                                                            <Edit className="size-3.5 mr-2" />Edit card
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDuplicate(card.id)}>
                                                            <Copy className="size-3.5 mr-2" />Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleCopyLink(card.slug)}>
                                                            <Share2 className="size-3.5 mr-2" />Copy link
                                                        </DropdownMenuItem>
                                                        {profile?.username && (
                                                            <DropdownMenuItem onClick={() => window.open(`${siteConfig.url}/${profile.username}/${card.slug}`, '_blank')}>
                                                                <ExternalLink className="size-3.5 mr-2" />View live
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => {
                                                            if (!profile?.username) { toast.error('Set username first'); return }
                                                            window.open(`/api/qr?slug=${card.slug}&username=${profile.username}`, '_blank')
                                                        }}>
                                                            <QrCode className="size-3.5 mr-2" />Download QR
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggleActive(card.id, card.is_active)}>
                                                            {card.is_active
                                                                ? <><X className="size-3.5 mr-2" />Deactivate</>
                                                                : <><Check className="size-3.5 mr-2" />Activate</>}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(card.id)}>
                                                            <Trash2 className="size-3.5 mr-2" />Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Action row */}
                                            <div className="flex gap-1.5">
                                                <Link href={`/cards/${card.id}/edit`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold gap-1">
                                                        <Edit className="size-3" />Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleCopyLink(card.slug)}
                                                    title="Copy link"
                                                >
                                                    <Copy className="size-3" />
                                                </Button>
                                                {profile?.username && (
                                                    <a
                                                        href={`${siteConfig.url}/${profile.username}/${card.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="View live">
                                                            <Eye className="size-3" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── List view ────────────── */}
                {!loading && filtered.length > 0 && view === 'list' && (
                    <div className="space-y-2">
                        {filtered.map((card, i) => {
                            const meta = TEMPLATE_META[card.template] ?? TEMPLATE_META.modern
                            const initials = (card.title ?? 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="group flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3 hover:shadow-md transition-shadow"
                                >
                                    {/* Color dot / avatar */}
                                    <div className={`size-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                                        {card.photo_url
                                            ? <img src={card.photo_url} alt="" className="size-full rounded-xl object-cover" />
                                            : <span className="text-xs font-black text-white">{initials}</span>
                                        }
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{card.title ?? 'Untitled card'}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {card.company && `${card.company} · `}
                                            <span className="font-mono">/{card.slug}</span>
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={cn(
                                            'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                            card.is_active
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-muted text-muted-foreground'
                                        )}>
                                            {card.is_active ? '● Live' : '○ Draft'}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-medium hidden sm:block capitalize">{card.template}</span>
                                    </div>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/cards/${card.id}/edit`}>
                                            <Button variant="ghost" size="icon-sm"><Edit className="size-3.5" /></Button>
                                        </Link>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleCopyLink(card.slug)}>
                                            <Copy className="size-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(card.id)}>
                                            <Trash2 className="size-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Delete dialog ──────────────────────────────────────────── */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete card</DialogTitle>
                        <DialogDescription>
                            Permanently delete{' '}
                            <span className="font-semibold text-foreground">{cardToDelete?.title ?? 'this card'}</span>?
                            All analytics and leads will also be removed. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete forever'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
