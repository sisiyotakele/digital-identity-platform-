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

export function DarkTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#22D3EE'

    return (
        <div className="min-h-screen bg-zinc-900 text-white font-sans">
            <div className="max-w-sm mx-auto px-6 py-10 space-y-8">
                <div className="text-center space-y-4">
                    {card.photo_url ? (
                        <img src={card.photo_url} alt={card.title ?? ''}
                            width={96} height={96}
                            className="size-24 rounded-full object-cover mx-auto ring-2 ring-current"
                            style={{ color: accent }} />
                    ) : (
                        <div className="size-24 rounded-full mx-auto flex items-center justify-center text-2xl font-bold"
                            style={{ background: `${accent}20`, color: accent }}>
                            {(card.title ?? 'U').charAt(0)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-xl font-bold">{card.title ?? ''}</h1>
                        {card.company && <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>{card.company}</p>}
                    </div>
                    {card.logo_url && (
                        <img src={card.logo_url} alt="Logo" width={80} height={24}
                            className="h-6 w-auto object-contain mx-auto opacity-50 filter brightness-0 invert" />
                    )}
                    {card.bio && <p className="text-sm text-zinc-400 leading-relaxed">{card.bio}</p>}
                </div>

                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />

                <div className="space-y-1">
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors">
                            <Mail className="size-4 shrink-0" style={{ color: accent }} />
                            <span className="text-zinc-300 truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors">
                            <Phone className="size-4 shrink-0" style={{ color: accent }} />
                            <span className="text-zinc-300">{card.phone}</span>
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors">
                            <Globe className="size-4 shrink-0" style={{ color: accent }} />
                            <span className="text-zinc-300 truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 text-sm py-3 px-4">
                            <MapPin className="size-4 shrink-0 text-zinc-500" />
                            <span className="text-zinc-500">{card.address}</span>
                        </div>
                    )}
                </div>

                {(card.social_links ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {(card.social_links ?? []).map((link) => (
                            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                onClick={() => onLinkClick?.(link.platform)}
                                className="size-10 rounded-lg flex items-center justify-center border border-zinc-700 hover:border-current transition-colors"
                                style={{ '--hover-color': accent } as React.CSSProperties}>
                                <SocialIcon platform={link.platform} className="size-4 text-zinc-400" />
                            </a>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-zinc-900 rounded-lg transition-opacity hover:opacity-90"
                            style={{ backgroundColor: accent }}>
                            <Download className="size-4" />
                            Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-400 hover:border-zinc-500 transition-colors">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
