import { Mail, Phone, Globe, MapPin, Download, Share2, Rocket } from 'lucide-react'
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

export function StartupTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#10B981'

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-sm mx-auto">
                <div
                    className="px-6 pt-10 pb-8 text-white"
                    style={{ background: `linear-gradient(160deg, #0F172A 0%, #1E293B 100%)` }}
                >
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accent }}>
                        <Rocket className="size-3" />
                        {card.company ?? 'Startup'}
                    </div>
                    <div className="flex items-end gap-4">
                        {card.photo_url ? (
                            <img src={card.photo_url} alt={card.title ?? ''}
                                width={72} height={72}
                                className="size-[72px] rounded-xl object-cover shrink-0" />
                        ) : (
                            <div className="size-[72px] rounded-xl flex items-center justify-center text-xl font-extrabold shrink-0"
                                style={{ backgroundColor: `${accent}30`, color: accent }}>
                                {(card.title ?? 'U').charAt(0)}
                            </div>
                        )}
                        <div className="mb-1">
                            <h1 className="text-xl font-extrabold leading-tight">{card.title ?? ''}</h1>
                            {card.company && <p className="text-xs font-medium mt-0.5 text-slate-400">{card.company}</p>}
                        </div>
                    </div>
                    {card.bio && <p className="text-sm text-slate-400 mt-4 leading-relaxed">{card.bio}</p>}
                </div>

                <div className="px-6 py-6 space-y-3">
                    {card.logo_url && (
                        <div className="pb-2">
                            <img src={card.logo_url} alt="Logo" width={80} height={28} className="h-7 w-auto object-contain" />
                        </div>
                    )}

                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-xl border border-border hover:border-foreground/30 hover:bg-slate-50 transition-all">
                            <Mail className="size-4 shrink-0" style={{ color: accent }} />
                            <span className="truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-xl border border-border hover:border-foreground/30 hover:bg-slate-50 transition-all">
                            <Phone className="size-4 shrink-0" style={{ color: accent }} />
                            {card.phone}
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-xl border border-border hover:border-foreground/30 hover:bg-slate-50 transition-all">
                            <Globe className="size-4 shrink-0" style={{ color: accent }} />
                            <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 text-sm py-3 px-4">
                            <MapPin className="size-4 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">{card.address}</span>
                        </div>
                    )}

                    {(card.social_links ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {(card.social_links ?? []).map((link) => {
                                const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                                return (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                        onClick={() => onLinkClick?.(link.platform)}
                                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                        style={{ backgroundColor: `${accent}15`, color: accent }}>
                                        <SocialIcon platform={link.platform} className="size-3.5" />
                                        {platform?.label}
                                    </a>
                                )
                            })}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        {onContactDownload && (
                            <button onClick={onContactDownload}
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-white rounded-xl transition-opacity hover:opacity-90"
                                style={{ backgroundColor: accent }}>
                                <Download className="size-4" />
                                Save contact
                            </button>
                        )}
                        {onShare && (
                            <button onClick={onShare}
                                className="flex items-center justify-center border border-border rounded-xl px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
                                <Share2 className="size-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
