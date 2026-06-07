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

export function GradientTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#6366F1'

    return (
        <div className="min-h-screen font-sans" style={{ background: `linear-gradient(160deg, ${accent}22 0%, white 50%, ${accent}11 100%)` }}>
            <div className="max-w-sm mx-auto px-6 py-10 space-y-6">
                <div
                    className="rounded-3xl p-6 text-white space-y-4 shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
                >
                    <div className="flex items-center gap-4">
                        {card.photo_url ? (
                            <img src={card.photo_url} alt={card.title ?? ''}
                                width={72} height={72}
                                className="size-[72px] rounded-2xl object-cover ring-2 ring-white/30 shrink-0" />
                        ) : (
                            <div className="size-[72px] rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
                                {(card.title ?? 'U').charAt(0)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-bold">{card.title ?? ''}</h1>
                            {card.company && <p className="text-sm opacity-80 mt-0.5">{card.company}</p>}
                        </div>
                    </div>
                    {card.bio && <p className="text-sm opacity-80 leading-relaxed">{card.bio}</p>}
                    {card.logo_url && (
                        <img src={card.logo_url} alt="Logo" width={80} height={24}
                            className="h-6 w-auto object-contain opacity-50 filter brightness-0 invert" />
                    )}
                </div>

                <div
                    className="rounded-2xl p-5 space-y-2 shadow-sm border border-white/80"
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}
                >
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm py-2 hover:opacity-80 transition-opacity">
                            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                                <Mail className="size-4" />
                            </div>
                            <span className="truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm py-2 hover:opacity-80 transition-opacity">
                            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                                <Phone className="size-4" />
                            </div>
                            {card.phone}
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm py-2 hover:opacity-80 transition-opacity">
                            <div className="size-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                                <Globe className="size-4" />
                            </div>
                            <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
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
                    <div
                        className="rounded-2xl p-4 shadow-sm border border-white/80"
                        style={{ backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}
                    >
                        <div className="flex flex-wrap gap-2 justify-center">
                            {(card.social_links ?? []).map((link) => {
                                const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                                return (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                        onClick={() => onLinkClick?.(link.platform)}
                                        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow transition-shadow">
                                        <SocialIcon platform={link.platform} className="size-3.5" style={{ color: accent }} />
                                        {platform?.label}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                            <Download className="size-4" />
                            Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center rounded-2xl px-4 py-3.5 bg-white shadow-sm hover:shadow transition-shadow border border-border">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
