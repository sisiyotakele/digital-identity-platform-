export { SOCIAL_PLATFORMS } from '../../../packages/shared/constants/platforms'
export { LIMITS } from '../../../packages/shared/constants/limits'

import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(dateString: string): string {
    return format(parseISO(dateString), 'MMM d, yyyy')
}

export function formatDateShort(dateString: string): string {
    return format(parseISO(dateString), 'MMM d')
}

export function formatRelativeTime(dateString: string): string {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true })
}

export function formatNumber(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toString()
}

export function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join('')
}

export function formatDateShortStr(dateString: string): string {
    return format(parseISO(dateString), 'MMM d')
}
