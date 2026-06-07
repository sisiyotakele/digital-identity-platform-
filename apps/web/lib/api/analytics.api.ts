import { createClient } from '@/lib/supabase/client'
import type { AnalyticsSummary } from '@/lib/types'
import type { Lead } from '@/lib/types'

export async function fetchAnalyticsSummary(cardId: string, days: number): Promise<AnalyticsSummary> {
    const supabase = createClient()
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, link_platform, created_at')
        .eq('card_id', cardId)
        .gte('created_at', since.toISOString())

    if (!events) {
        return {
            total_views: 0,
            total_contact_downloads: 0,
            total_link_clicks: 0,
            total_qr_scans: 0,
            total_share_clicks: 0,
            events_by_day: [],
            top_platforms: [],
        }
    }

    const total_views = events.filter((e) => e.event_type === 'card_view').length
    const total_contact_downloads = events.filter((e) => e.event_type === 'contact_download').length
    const total_link_clicks = events.filter((e) => e.event_type === 'link_click').length
    const total_qr_scans = events.filter((e) => e.event_type === 'qr_scan').length
    const total_share_clicks = events.filter((e) => e.event_type === 'share_click').length

    const dayMap: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dayMap[d.toISOString().split('T')[0]] = 0
    }
    for (const e of events) {
        if (e.event_type === 'card_view') {
            const day = e.created_at.split('T')[0]
            if (day in dayMap) dayMap[day]++
        }
    }
    const events_by_day = Object.entries(dayMap).map(([date, count]) => ({ date, count }))

    const platformMap: Record<string, number> = {}
    for (const e of events) {
        if (e.event_type === 'link_click' && e.link_platform) {
            platformMap[e.link_platform] = (platformMap[e.link_platform] ?? 0) + 1
        }
    }
    const top_platforms = Object.entries(platformMap)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)

    return {
        total_views,
        total_contact_downloads,
        total_link_clicks,
        total_qr_scans,
        total_share_clicks,
        events_by_day,
        top_platforms,
    }
}

export async function fetchAllCardsAnalytics(days: number): Promise<AnalyticsSummary> {
    const supabase = createClient()
    const since = new Date()
    since.setDate(since.getDate() - days)

    const { data: cards } = await supabase.from('business_cards').select('id')
    if (!cards || cards.length === 0) {
        return {
            total_views: 0,
            total_contact_downloads: 0,
            total_link_clicks: 0,
            total_qr_scans: 0,
            total_share_clicks: 0,
            events_by_day: [],
            top_platforms: [],
        }
    }

    const cardIds = cards.map((c) => c.id)
    const { data: events } = await supabase
        .from('analytics_events')
        .select('event_type, link_platform, created_at')
        .in('card_id', cardIds)
        .gte('created_at', since.toISOString())

    if (!events) {
        return {
            total_views: 0,
            total_contact_downloads: 0,
            total_link_clicks: 0,
            total_qr_scans: 0,
            total_share_clicks: 0,
            events_by_day: [],
            top_platforms: [],
        }
    }

    const total_views = events.filter((e) => e.event_type === 'card_view').length
    const total_contact_downloads = events.filter((e) => e.event_type === 'contact_download').length
    const total_link_clicks = events.filter((e) => e.event_type === 'link_click').length
    const total_qr_scans = events.filter((e) => e.event_type === 'qr_scan').length
    const total_share_clicks = events.filter((e) => e.event_type === 'share_click').length

    const dayMap: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        dayMap[d.toISOString().split('T')[0]] = 0
    }
    for (const e of events) {
        if (e.event_type === 'card_view') {
            const day = e.created_at.split('T')[0]
            if (day in dayMap) dayMap[day]++
        }
    }
    const events_by_day = Object.entries(dayMap).map(([date, count]) => ({ date, count }))

    const platformMap: Record<string, number> = {}
    for (const e of events) {
        if (e.event_type === 'link_click' && e.link_platform) {
            platformMap[e.link_platform] = (platformMap[e.link_platform] ?? 0) + 1
        }
    }
    const top_platforms = Object.entries(platformMap)
        .map(([platform, count]) => ({ platform, count }))
        .sort((a, b) => b.count - a.count)

    return {
        total_views,
        total_contact_downloads,
        total_link_clicks,
        total_qr_scans,
        total_share_clicks,
        events_by_day,
        top_platforms,
    }
}

export async function fetchLeads(cardId: string): Promise<Lead[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('card_id', cardId)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data ?? []
}

export async function submitLead(input: { card_id: string; name: string; email?: string; phone?: string; message?: string }): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('leads').insert(input)
    if (error) throw new Error(error.message)
}
