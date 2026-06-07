import type { AnalyticsEventType } from '@/lib/types'
import { createClient } from './supabase/client'

interface TrackEventOptions {
    card_id: string
    event_type: AnalyticsEventType
    device_type?: string
    country?: string
    link_platform?: string
}

export async function trackEvent(options: TrackEventOptions): Promise<void> {
    const supabase = createClient()
    await supabase.from('analytics_events').insert({
        card_id: options.card_id,
        event_type: options.event_type,
        device_type: options.device_type ?? detectDeviceType(),
        country: options.country ?? null,
        link_platform: options.link_platform ?? null,
    })
}

export function detectDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'
    const ua = navigator.userAgent
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return 'mobile'
    if (/Tablet|iPad/i.test(ua)) return 'tablet'
    return 'desktop'
}
