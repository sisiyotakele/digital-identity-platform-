'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Eye, Download, MousePointerClick, QrCode, Share2 } from 'lucide-react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchUserCards } from '@/lib/api/card.api'
import { fetchAnalyticsSummary, fetchAllCardsAnalytics } from '@/lib/api/analytics.api'
import { formatNumber, formatDateShort } from '@/lib/constants'
import type { AnalyticsSummary, BusinessCard } from '@/lib/types'

const RANGES = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
]

export default function AnalyticsPage() {
    const [cards, setCards] = useState<BusinessCard[]>([])
    const [selectedCard, setSelectedCard] = useState<string>('all')
    const [days, setDays] = useState(30)
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserCards().then(setCards)
    }, [])

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const data = selectedCard === 'all'
                ? await fetchAllCardsAnalytics(days)
                : await fetchAnalyticsSummary(selectedCard, days)
            setSummary(data)
        } finally {
            setLoading(false)
        }
    }, [selectedCard, days])

    useEffect(() => { load() }, [load])

    const stats = [
        { label: 'Total views', value: summary?.total_views ?? 0, icon: Eye, color: 'text-blue-500' },
        { label: 'Contact downloads', value: summary?.total_contact_downloads ?? 0, icon: Download, color: 'text-green-500' },
        { label: 'Link clicks', value: summary?.total_link_clicks ?? 0, icon: MousePointerClick, color: 'text-purple-500' },
        { label: 'QR scans', value: summary?.total_qr_scans ?? 0, icon: QrCode, color: 'text-orange-500' },
        { label: 'Shares', value: summary?.total_share_clicks ?? 0, icon: Share2, color: 'text-pink-500' },
    ]

    const chartData = (summary?.events_by_day ?? []).map((d) => ({
        date: formatDateShort(d.date),
        views: d.count,
    }))

    const barData = [
        { name: 'Views', value: summary?.total_views ?? 0 },
        { name: 'Downloads', value: summary?.total_contact_downloads ?? 0 },
        { name: 'Clicks', value: summary?.total_link_clicks ?? 0 },
        { name: 'QR Scans', value: summary?.total_qr_scans ?? 0 },
        { name: 'Shares', value: summary?.total_share_clicks ?? 0 },
    ]

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">Track how people interact with your cards</p>
            </div>

            <div className="flex flex-wrap gap-3">
                <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className="h-8 rounded-lg border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <option value="all">All cards</option>
                    {cards.map((c) => (
                        <option key={c.id} value={c.id}>{c.title ?? c.slug}</option>
                    ))}
                </select>

                <div className="flex gap-1 bg-muted rounded-lg p-1">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setDays(r.value)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${days === r.value ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    loading ? (
                        <Skeleton key={label} className="h-24 rounded-xl" />
                    ) : (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardContent className="p-4">
                                    <Icon className={`size-4 mb-2 ${color}`} />
                                    <div className="text-2xl font-bold">{formatNumber(value)}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Views over time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Event breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={barData} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {(summary?.top_platforms ?? []).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Top platforms clicked</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {(summary?.top_platforms ?? []).slice(0, 6).map(({ platform, count }) => {
                                const max = summary?.top_platforms[0]?.count ?? 1
                                return (
                                    <div key={platform}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize">{platform}</span>
                                            <span className="text-muted-foreground">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${(count / max) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
