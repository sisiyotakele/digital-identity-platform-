'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { fetchUserCards, deleteCard } from '@/lib/api/card.api'
import type { BusinessCard } from '@/lib/types'

export function useCards() {
    const [cards, setCards] = useState<BusinessCard[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadCards = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchUserCards()
            setCards(data)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load cards'
            setError(message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadCards()
    }, [loadCards])

    async function removeCard(id: string) {
        try {
            await deleteCard(id)
            setCards((prev) => prev.filter((c) => c.id !== id))
            toast.success('Card deleted')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete card'
            toast.error(message)
        }
    }

    return { cards, loading, error, refresh: loadCards, removeCard }
}
