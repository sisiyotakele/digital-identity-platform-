import type { BusinessCard } from '@/lib/types'
import { MinimalTemplate } from './templates/MinimalTemplate'
import { ModernTemplate } from './templates/ModernTemplate'
import { CorporateTemplate } from './templates/CorporateTemplate'
import { CreativeTemplate } from './templates/CreativeTemplate'
import { ExecutiveTemplate } from './templates/ExecutiveTemplate'
import { DarkTemplate } from './templates/DarkTemplate'
import { GradientTemplate } from './templates/GradientTemplate'
import { StartupTemplate } from './templates/StartupTemplate'

interface CardTemplateRendererProps {
    card: BusinessCard
    onContactDownload?: () => void
    onShare?: () => void
    onLinkClick?: (platform: string) => void
    onEmailClick?: () => void
    onPhoneClick?: () => void
    onWebsiteClick?: () => void
}

export function CardTemplateRenderer(props: CardTemplateRendererProps) {
    const { card } = props

    switch (card.template) {
        case 'modern':
            return <ModernTemplate {...props} />
        case 'corporate':
            return <CorporateTemplate {...props} />
        case 'creative':
            return <CreativeTemplate {...props} />
        case 'executive':
            return <ExecutiveTemplate {...props} />
        case 'dark':
            return <DarkTemplate {...props} />
        case 'gradient':
            return <GradientTemplate {...props} />
        case 'startup':
            return <StartupTemplate {...props} />
        default:
            return <MinimalTemplate {...props} />
    }
}
