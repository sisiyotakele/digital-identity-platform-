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

export function ModernTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#1B4F8A'

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="h-48 w-full relative" style={{ background: `linear-gradient(135deg, ${accent}ee, ${accent})` }}>
                {card.logo_url && (
                    <div className="absolute top-4 right-4">
                        <img src={card.logo_url} alt="Logo" width={64} height={32} className="h-8 w-auto object-contain opacity-80" />
                    </div>
                )}
                <div className="absolute -bottom-12 left-6">
                    {card.photo_url ? (
                        <img src={card.photo_url} alt={card.title ?? ''} width={96} height={96}
                            className="size-24 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                    ) : (
                        <div className="size-24 rounded-2xl ring-4 ring-white shadow-lg flex items-center justify-center text-white text-2xl font-bold"
                            style={{ backgroundColor: accent }}>
                            {(card.title ?? 'U').charAt(0)}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-sm mx-auto px-6 pt-16 pb-10 space-y-6">
                <div>
                    <h1 className="text-xl font-bold">{card.title ?? ''}</h1>
                    {card.company && <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>{card.company}</p>}
                    {card.bio && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{card.bio}</p>}
                </div>

                <div className="space-y-3">
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow transition-shadow">
                            <Mail className="size-4 shrink-0" style={{ color: accent }} /><span className="truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow transition-shadow">
                            <Phone className="size-4 shrink-0" style={{ color: accent }} />{card.phone}
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow transition-shadow">
                            <Globe className="size-4 shrink-0" style={{ color: accent }} /><span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 text-sm bg-white rounded-xl px-4 py-3 shadow-sm">
                            <MapPin className="size-4 shrink-0 text-muted-foreground" /><span className="text-muted-foreground">{card.address}</span>
                        </div>
                    )}
                </div>

                {(card.social_links ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {(card.social_links ?? []).map((link) => {
                            const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                            return (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    onClick={() => onLinkClick?.(link.platform)}
                                    className="flex items-center gap-1.5 bg-white rounded-lg px-3 py-2 text-xs font-medium shadow-sm hover:shadow transition-shadow">
                                    <SocialIcon platform={link.platform} className="size-3.5" />{platform?.label}
                                </a>
                            )
                        })}
                    </div>
                )}

                <div className="flex gap-3">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                            style={{ backgroundColor: accent }}>
                            <Download className="size-4" />Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center bg-white rounded-xl px-4 py-3 text-sm shadow-sm hover:shadow transition-shadow">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
