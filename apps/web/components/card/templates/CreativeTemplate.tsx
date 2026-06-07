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

export function CreativeTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#7C3AED'

    return (
        <div className="min-h-screen bg-white font-sans overflow-hidden">
            <div className="relative">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" style={{ backgroundColor: accent }} />
                <div className="absolute top-24 left-0 w-32 h-32 rounded-full -translate-x-1/2 opacity-10" style={{ backgroundColor: accent }} />

                <div className="relative px-6 pt-10 pb-6 max-w-sm mx-auto">
                    <div className="flex items-end gap-4 mb-6">
                        {card.photo_url ? (
                            <img src={card.photo_url} alt={card.title ?? ''} width={80} height={80}
                                className="size-20 rounded-2xl object-cover shadow-lg shrink-0" />
                        ) : (
                            <div className="size-20 rounded-2xl shadow-lg flex items-center justify-center text-white text-xl font-bold shrink-0"
                                style={{ backgroundColor: accent }}>
                                {(card.title ?? 'U').charAt(0)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl font-extrabold leading-tight">{card.title ?? ''}</h1>
                            {card.company && <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>{card.company}</p>}
                        </div>
                    </div>

                    {card.logo_url && <img src={card.logo_url} alt="Logo" width={64} height={24} className="h-6 w-auto object-contain mb-4 opacity-60" />}
                    {card.bio && <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">&ldquo;{card.bio}&rdquo;</p>}

                    <div className="space-y-2 mb-6">
                        {card.email && (
                            <a href={`mailto:${card.email}`} onClick={onEmailClick} className="flex items-center gap-3 text-sm py-2 group">
                                <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                                    <Mail className="size-4" style={{ color: accent }} />
                                </div>
                                <span className="group-hover:underline truncate">{card.email}</span>
                            </a>
                        )}
                        {card.phone && (
                            <a href={`tel:${card.phone}`} onClick={onPhoneClick} className="flex items-center gap-3 text-sm py-2 group">
                                <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                                    <Phone className="size-4" style={{ color: accent }} />
                                </div>
                                <span className="group-hover:underline">{card.phone}</span>
                            </a>
                        )}
                        {card.website && (
                            <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick} className="flex items-center gap-3 text-sm py-2 group">
                                <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
                                    <Globe className="size-4" style={{ color: accent }} />
                                </div>
                                <span className="group-hover:underline truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                        {card.address && (
                            <div className="flex items-center gap-3 text-sm py-2">
                                <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                                    <MapPin className="size-4 text-muted-foreground" />
                                </div>
                                <span className="text-muted-foreground">{card.address}</span>
                            </div>
                        )}
                    </div>

                    {(card.social_links ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(card.social_links ?? []).map((link) => (
                                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                    onClick={() => onLinkClick?.(link.platform)}
                                    className="size-10 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                                    style={{ backgroundColor: `${accent}15` }}>
                                    <SocialIcon platform={link.platform} className="size-5" />
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        {onContactDownload && (
                            <button onClick={onContactDownload}
                                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
                                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                                <Download className="size-4" />Save contact
                            </button>
                        )}
                        {onShare && (
                            <button onClick={onShare}
                                className="flex items-center justify-center rounded-2xl px-4 py-3.5 border-2 transition-colors hover:bg-muted"
                                style={{ borderColor: accent }}>
                                <Share2 className="size-4" style={{ color: accent }} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
