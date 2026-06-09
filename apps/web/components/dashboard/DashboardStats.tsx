'use client'

import { motion } from 'framer-motion'
import { Eye, CreditCard, Download, MousePointerClick } from 'lucide-react'
import { formatNumber } from '@/lib/constants'

export type StatKey = 'views' | 'cards' | 'downloads' | 'clicks'

export interface Stat {
    label: string
    value: number
    key: StatKey
    change: string
}

const iconMap: Record<StatKey, React.ElementType> = {
    views: Eye,
    cards: CreditCard,
    downloads: Download,
    clicks: MousePointerClick,
}

const colorMap: Record<StatKey, { color: string; bg: string }> = {
    views: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    cards: { color: 'text-violet-500', bg: 'bg-violet-500/10' },
    downloads: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    clicks: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
}

export function DashboardStats({ stats }: { stats: Stat[] }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
                const Icon = iconMap[stat.key]
                const { color, bg } = colorMap[stat.key]
                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.4 }}
                        className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                            <div className={`size-8 rounded-xl flex items-center justify-center ${bg}`}>
                                <Icon className={`size-4 ${color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{formatNumber(stat.value)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </motion.div>
                )
            })}
        </div>
    )
}
