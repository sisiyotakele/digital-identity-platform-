'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardTemplateRenderer } from '@/components/card/CardTemplateRenderer'
import { fetchCard } from '@/lib/api/card.api'
import type { BusinessCard } from '@/lib/types'

export default function CardPreviewPage() {
    const { id } = useParams<{ id: string }>()
    const [card, setCard] = useState<BusinessCard | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCard(id).then(setCard).finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-[600px] w-full max-w-sm mx-auto" />
            </div>
        )
    }

    if (!card) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">Card not found</p>
                <Link href="/cards"><Button className="mt-4" variant="outline">Back to cards</Button></Link>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
                <Link href={`/cards/${id}/edit`}>
                    <Button variant="ghost" size="icon-sm">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <h1 className="text-lg font-semibold">Preview — {card.title ?? card.slug}</h1>
            </div>
            <div className="max-w-sm mx-auto border border-border rounded-2xl overflow-hidden shadow-lg">
                <CardTemplateRenderer card={card} />
            </div>
        </div>
    )
}
