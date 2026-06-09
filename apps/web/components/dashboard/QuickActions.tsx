'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, BarChart2, Settings, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/config/site'

interface Action {
    label: string
    description: string
    href: string
    icon: React.ElementType
    external: boolean
    color: string
}

export function QuickActions({
    hasCards,
    username,
}: {
    hasCards: boolean
    username: string | null
}) {
    const actions: Action[] = [
        {
            label: 'Create Card',
            description: 'Build a new digital card',
            href: '/cards/create',
            icon: Plus,
            external: false,
            color: 'bg-primary/10 text-primary',
        },
        {
            label: 'Analytics',
            description: 'View performance data',
            href: '/analytics',
            icon: BarChart2,
            external: false,
            color: 'bg-blue-500/10 text-blue-500',
        },
        {
            label: 'Settings',
            description: 'Update your profile',
            href: '/settings',
            icon: Settings,
            external: false,
            color: 'bg-violet-500/10 text-violet-500',
        },
        ...(hasCards && username
            ? ([
                {
                    label: 'Your Profile',
                    description: `${siteConfig.url}/${username}`,
                    href: `${siteConfig.url}/${username}`,
                    icon: ExternalLink,
                    external: true,
                    color: 'bg-emerald-500/10 text-emerald-500',
                },
            ] as Action[])
            : []),
    ]

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-sm">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1">
                {actions.map((action, i) => (
                    <motion.div
                        key={action.label}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                    >
                        {action.external ? (
                            <a
                                href={action.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group"
                            >
                                <ActionContent action={action} />
                            </a>
                        ) : (
                            <Link
                                href={action.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group"
                            >
                                <ActionContent action={action} />
                            </Link>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function ActionContent({ action }: { action: Action }) {
    return (
        <>
            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                <action.icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground truncate">{action.description}</p>
            </div>
            <div className="size-5 rounded-md bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="size-3 text-muted-foreground" />
            </div>
        </>
    )
}
