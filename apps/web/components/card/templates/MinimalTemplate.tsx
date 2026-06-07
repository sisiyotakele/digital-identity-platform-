import { Mail, Phone, Globe, MapPin, Download, Share2 } from 'lucide-react'
import type { BusinessCard } from '@/lib/types'
import { SOCIAL_PLATFORMS } from '@/lib/constants'
import { SocialIcon } from '../SocialIcon'

interface TemplateProps {
    card: BusinessCard
    onContactDownload?: () => void
    onShare?: () => void
    onLinkClick?: (platform: string) => void
    onEmailClick?: () => void
    onPhoneClick?: () => void
    onWebsiteClick?: () => void
}

export function MinimalTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    return (
        <div className="bg-white min-h-screen font-sans">
            <div className="max-w-sm mx-auto px-6 py-12 space-y-8">
                {card.photo_url && (
                    <div className="flex justify-center">
                        <img src={card.photo_url} alt={card.title ?? ''} width={96} height={96}
                            className="size-24 rounded-full object-cover ring-1 ring-border" />
                    </div>
                )}

                <div className="text-center space-y-1">
                    <h1 className="text-xl font-semibold tracking-tight">{card.title ?? ''}</h1>
                    {card.company && <p className="text-sm text-muted-foreground">{card.company}</p>}
                    {card.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{card.bio}</p>}
                </div>

                {card.logo_url && (
                    <div className="flex justify-center">
                        <img src={card.logo_url} alt="Company logo" width={80} height={40} className="h-10 w-auto object-contain" />
                    </div>
                )}

                <div className="space-y-2">
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm text-foreground py-2 hover:text-muted-foreground transition-colors">
                            <Mail className="size-4 text-muted-foreground shrink-0" />{card.email}
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm text-foreground py-2 hover:text-muted-foreground transition-colors">
                            <Phone className="size-4 text-muted-foreground shrink-0" />{card.phone}
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm text-foreground py-2 hover:text-muted-foreground transition-colors">
                            <Globe className="size-4 text-muted-foreground shrink-0" />{card.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground py-2">
                            <MapPin className="size-4 shrink-0" />{card.address}
                        </div>
                    )}
                </div>

                {(card.social_links ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                        {(card.social_links ?? []).map((link) => {
                            const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                            return (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    onClick={() => onLinkClick?.(link.platform)}
                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <SocialIcon platform={link.platform} className="size-4" />
                                    <span>{platform?.label}</span>
                                </a>
                            )
                        })}
                    </div>
                )}

                <div className="flex gap-3">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                            <Download className="size-4" />Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center border border-border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
