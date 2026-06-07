'use client'

import { useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { AnalyticsEventType } from '@/lib/types'

export function useAnalytics(cardId: string) {
    const track = useCallback(
        (eventType: AnalyticsEventType, extra?: { link_platform?: string }) => {
            trackEvent({ card_id: cardId, event_type: eventType, ...extra })
        },
        [cardId]
    )

    return { track }
}
