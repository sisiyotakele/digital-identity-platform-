export type AnalyticsEventType =
    | 'card_view'
    | 'contact_download'
    | 'link_click'
    | 'qr_scan'
    | 'share_click'
    | 'email_click'
    | 'phone_click'
    | 'website_click'

export interface AnalyticsEvent {
    id: string
    card_id: string
    event_type: AnalyticsEventType
    device_type: string | null
    country: string | null
    link_platform: string | null
    created_at: string
}

export interface AnalyticsSummary {
    total_views: number
    total_contact_downloads: number
    total_link_clicks: number
    total_qr_scans: number
    total_share_clicks: number
    events_by_day: { date: string; count: number }[]
    top_platforms: { platform: string; count: number }[]
}

export interface DailyAnalytics {
    id: string
    card_id: string
    date: string
    views: number
    contact_downloads: number
    link_clicks: number
    qr_scans: number
    share_clicks: number
}
