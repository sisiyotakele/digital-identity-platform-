'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Printer, QrCode, Download, Eye, RotateCcw, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchUserCards } from '@/lib/api/card.api'
import { fetchCurrentProfile } from '@/lib/api/user.api'
import { siteConfig } from '@/config/site'
import type { BusinessCard } from '@/lib/types'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

const PRINT_TEMPLATES = [
    { id: 'modern-corp', name: 'Modern Corporate', bg: 'from-blue-600 to-blue-800', accent: '#3B82F6' },
    { id: 'luxury-gold', name: 'Luxury Gold', bg: 'from-amber-800 to-amber-950', accent: '#D97706' },
    { id: 'minimalist', name: 'Minimalist', bg: 'from-gray-100 to-gray-200', accent: '#374151', dark: false },
    { id: 'premium-dark', name: 'Premium Dark', bg: 'from-zinc-800 to-zinc-950', accent: '#22D3EE' },
    { id: 'elegant-white', name: 'Elegant White', bg: 'from-white to-gray-50', accent: '#1B4F8A', dark: false },
    { id: 'tech-startup', name: 'Tech Startup', bg: 'from-violet-600 to-purple-800', accent: '#8B5CF6' },
]

export default function PrintPage() {
    const [cards, setCards] = useState<BusinessCard[]>([])
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedCard, setSelectedCard] = useState<string | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState(PRINT_TEMPLATES[0].id)
    const [showBack, setShowBack] = useState(false)
    const [flipped, setFlipped] = useState(false)

    useEffect(() => {
        Promise.all([fetchUserCards(), fetchCurrentProfile()]).then(([c, p]) => {
            setCards(c)
            setProfile(p)
            if (c.length > 0) setSelectedCard(c[0].id)
        }).finally(() => setLoading(false))
    }, [])

    const card = cards.find((c) => c.id === selectedCard)
    const template = PRINT_TEMPLATES.find((t) => t.id === selectedTemplate)!
    const cardUrl = card && profile?.username ? `${siteConfig.url}/${profile.username}/${card.slug}` : siteConfig.url

    function handleDownloadPDF() {
        if (!card) {
            toast.error('Select a card first')
            return
        }
        if (!profile?.username) {
            toast.error('Set your username in Settings before downloading PDF')
            return
        }
        // Use fetch + blob for reliable download across browsers
        const url = `/api/pdf?slug=${encodeURIComponent(card.slug)}&username=${encodeURIComponent(profile.username)}`
        toast.promise(
            fetch(url)
                .then(async (res) => {
                    if (!res.ok) {
                        const err = await res.json().catch(() => ({ error: 'Download failed' })) as { error?: string }
                        throw new Error(err.error ?? `Error ${res.status}`)
                    }
                    return res.blob()
                })
                .then((blob) => {
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = `${card.title ?? 'business-card'}.pdf`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(a.href)
                }),
            {
                loading: 'Generating PDF…',
                success: 'PDF downloaded',
                error: (e: Error) => e.message,
            }
        )
    }

    return (
        <div className="p-5 md:p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-black">Print Cards</h1>
                <p className="text-sm text-muted-foreground mt-1">Design and preview your physical business card</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-[600px] rounded-2xl" />
                    <Skeleton className="h-[600px] rounded-2xl" />
                </div>
            ) : cards.length === 0 ? (
                <div className="text-center py-20">
                    <Printer className="size-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-bold text-lg mb-2">No cards to print</p>
                    <p className="text-sm text-muted-foreground mb-6">Create a digital card first, then come back to print it.</p>
                    <Button onClick={() => window.location.href = '/cards/create'}>Create a card</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Left: Controls */}
                    <div className="space-y-6">
                        {/* Card selector */}
                        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-sm">Select card</h2>
                            <div className="space-y-2">
                                {cards.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCard(c.id)}
                                        className={cn(
                                            'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                                            selectedCard === c.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/40'
                                        )}
                                    >
                                        <div className={cn('size-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br', c.template === 'dark' ? 'from-zinc-700 to-zinc-900' : 'from-blue-500 to-blue-700')}>
                                            {(c.title ?? 'C').charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{c.title ?? 'Untitled'}</p>
                                            <p className="text-xs text-muted-foreground">/{c.slug}</p>
                                        </div>
                                        {selectedCard === c.id && <Check className="size-4 text-primary ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Template selector */}
                        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                            <h2 className="font-bold text-sm">Print template</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {PRINT_TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={cn(
                                            'rounded-xl overflow-hidden border-2 transition-all',
                                            selectedTemplate === t.id ? 'border-primary scale-[1.02]' : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        <div className={`h-12 bg-gradient-to-br ${t.bg}`} />
                                        <div className="bg-card px-2 py-1.5 text-center">
                                            <p className="text-[10px] font-semibold truncate">{t.name}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                            <h2 className="font-bold text-sm">Export</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="gap-2" onClick={handleDownloadPDF}>
                                    <Download className="size-4" />Download PDF
                                </Button>
                                <Button variant="outline" className="gap-2" onClick={() => window.open(`/api/qr?slug=${card?.slug}&username=${profile?.username}`, '_blank')}>
                                    <QrCode className="size-4" />Download QR
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Standard business card size (85mm × 54mm) at 300 DPI.
                            </p>
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm">Preview</h2>
                            <div className="flex gap-2">
                                <Button
                                    variant={!showBack ? 'default' : 'outline'}
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => { setShowBack(false); setFlipped(false) }}
                                >
                                    Front
                                </Button>
                                <Button
                                    variant={showBack ? 'default' : 'outline'}
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => { setShowBack(true); setFlipped(true) }}
                                >
                                    Back
                                </Button>
                                <Button variant="outline" size="icon-sm" onClick={() => setFlipped(!flipped)} aria-label="Flip card">
                                    <RotateCcw className="size-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* 3D Card mockup */}
                        <div className="flex items-center justify-center py-8">
                            <div
                                className="relative cursor-pointer"
                                style={{ perspective: '1000px' }}
                                onClick={() => setFlipped(!flipped)}
                            >
                                <motion.div
                                    animate={{ rotateY: flipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: 'spring', stiffness: 150, damping: 20 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    className="relative w-[340px] h-[200px]"
                                >
                                    {/* Front */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${template.bg} p-6 shadow-2xl`}
                                        style={{ backfaceVisibility: 'hidden' }}
                                    >
                                        <div className="flex justify-between items-start h-full">
                                            <div className="flex flex-col justify-between h-full">
                                                {card?.photo_url ? (
                                                    <img src={card.photo_url} alt="" className="size-12 rounded-xl object-cover" />
                                                ) : (
                                                    <div className="size-12 rounded-xl bg-white/20" />
                                                )}
                                                <div>
                                                    <p className={`font-black text-base leading-tight ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-900' : 'text-white'}`}>
                                                        {card?.title ?? 'Abel Abebe'}
                                                    </p>
                                                    <p className={`text-xs mt-0.5 ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-600' : 'text-white/70'}`}>
                                                        {card?.company ?? 'UNIQUE'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end justify-between h-full">
                                                <p className={`text-xs font-black tracking-widest ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-500' : 'text-white/50'}`}>
                                                    UNIQUE
                                                </p>
                                                <div className="text-right">
                                                    {card?.email && <p className={`text-[10px] ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-500' : 'text-white/60'}`}>{card.email}</p>}
                                                    {card?.phone && <p className={`text-[10px] ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-500' : 'text-white/60'}`}>{card.phone}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${template.bg} p-6 shadow-2xl flex items-center justify-center`}
                                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <QRCodeMini url={cardUrl} />
                                            <p className={`text-[9px] font-mono text-center break-all max-w-[200px] ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-400' : 'text-white/40'}`}>
                                                {cardUrl}
                                            </p>
                                            <p className={`text-[10px] font-black tracking-widest ${template.id === 'minimalist' || template.id === 'elegant-white' ? 'text-gray-400' : 'text-white/40'}`}>
                                                UNIQUE DIGITAL CARD
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">Click card to flip • Preview is proportional to 85×54mm</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function QRCodeMini({ url }: { url: string }) {
    const [src, setSrc] = useState<string | null>(null)
    useEffect(() => {
        import('qrcode').then((QR) => {
            QR.toDataURL(url, { width: 80, margin: 1, color: { dark: '#000000', light: '#FFFFFF' } }).then(setSrc)
        })
    }, [url])
    if (!src) return <div className="size-20 bg-white/20 rounded-lg animate-pulse" />
    return <img src={src} alt="QR" className="size-20 rounded-lg bg-white p-1" />
}
