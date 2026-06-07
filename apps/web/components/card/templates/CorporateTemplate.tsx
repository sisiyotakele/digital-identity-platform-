import { Mail, Phone, Globe, MapPin, Download, Share2, Building2 } from 'lucide-react'
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

export function CorporateTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    const accent = card.theme_color ?? '#1B4F8A'

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="border-b-4 py-6 px-6 flex items-center justify-between" style={{ borderColor: accent }}>
                {card.logo_url ? (
                    <img src={card.logo_url} alt="Company logo" width={120} height={48} className="h-12 w-auto object-contain" />
                ) : (
                    <div className="flex items-center gap-2">
                        <Building2 className="size-6" style={{ color: accent }} />
                        <span className="font-bold text-sm tracking-wide uppercase" style={{ color: accent }}>{card.company ?? 'Company'}</span>
                    </div>
                )}
                <div className="text-right">
                    {card.photo_url && (
                        <img src={card.photo_url} alt={card.title ?? ''} width={64} height={64}
                            className="size-16 rounded-full object-cover ml-auto mb-2" />
                    )}
                </div>
            </div>

            <div className="max-w-sm mx-auto px-6 py-8 space-y-6">
                <div className="border-l-4 pl-4" style={{ borderColor: accent }}>
                    <h1 className="text-xl font-bold text-foreground">{card.title ?? ''}</h1>
                    {card.company && <p className="text-sm text-muted-foreground mt-0.5 uppercase tracking-wide font-medium">{card.company}</p>}
                </div>

                {card.bio && <p className="text-sm text-muted-foreground leading-relaxed">{card.bio}</p>}

                <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
                            <Mail className="size-4 shrink-0" style={{ color: accent }} /><span className="truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
                            <Phone className="size-4 shrink-0" style={{ color: accent }} />{card.phone}
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors">
                            <Globe className="size-4 shrink-0" style={{ color: accent }} /><span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 px-4 py-3 text-sm">
                            <MapPin className="size-4 shrink-0 text-muted-foreground" /><span className="text-muted-foreground">{card.address}</span>
                        </div>
                    )}
                </div>

                {(card.social_links ?? []).length > 0 && (
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Connect</p>
                        <div className="flex flex-wrap gap-2">
                            {(card.social_links ?? []).map((link) => {
                                const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform)
                                return (
                                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                                        onClick={() => onLinkClick?.(link.platform)}
                                        className="flex items-center gap-1.5 border border-border rounded px-3 py-1.5 text-xs font-medium hover:border-foreground transition-colors">
                                        <SocialIcon platform={link.platform} className="size-3.5" />{platform?.label}
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-2">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded"
                            style={{ backgroundColor: accent }}>
                            <Download className="size-4" />Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center border border-border rounded px-4 py-3 text-sm hover:bg-muted transition-colors">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
