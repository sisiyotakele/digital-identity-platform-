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

export function ExecutiveTemplate({ card, onContactDownload, onShare, onLinkClick, onEmailClick, onPhoneClick, onWebsiteClick }: TemplateProps) {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
            <div className="max-w-sm mx-auto px-6 py-10 space-y-8">
                <div className="flex items-center gap-4">
                    {card.photo_url ? (
                        <img src={card.photo_url} alt={card.title ?? ''} width={80} height={80}
                            className="size-20 rounded-full object-cover ring-2 ring-yellow-400/50 shrink-0" />
                    ) : (
                        <div className="size-20 rounded-full ring-2 ring-yellow-400/50 flex items-center justify-center text-yellow-400 text-2xl font-bold shrink-0 bg-neutral-800">
                            {(card.title ?? 'U').charAt(0)}
                        </div>
                    )}
                    <div>
                        {card.logo_url && (
                            <img src={card.logo_url} alt="Logo" width={80} height={24}
                                className="h-6 w-auto object-contain opacity-60 mb-2 brightness-0 invert" />
                        )}
                        <h1 className="text-xl font-bold">{card.title ?? ''}</h1>
                        {card.company && <p className="text-sm text-yellow-400 mt-0.5 font-medium">{card.company}</p>}
                    </div>
                </div>

                <div className="border-t border-neutral-800" />
                {card.bio && <p className="text-sm text-neutral-400 leading-relaxed">{card.bio}</p>}

                <div className="space-y-2">
                    {card.email && (
                        <a href={`mailto:${card.email}`} onClick={onEmailClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors">
                            <Mail className="size-4 text-yellow-400 shrink-0" /><span className="text-neutral-300 truncate">{card.email}</span>
                        </a>
                    )}
                    {card.phone && (
                        <a href={`tel:${card.phone}`} onClick={onPhoneClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors">
                            <Phone className="size-4 text-yellow-400 shrink-0" /><span className="text-neutral-300">{card.phone}</span>
                        </a>
                    )}
                    {card.website && (
                        <a href={card.website} target="_blank" rel="noopener noreferrer" onClick={onWebsiteClick}
                            className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors">
                            <Globe className="size-4 text-yellow-400 shrink-0" /><span className="text-neutral-300 truncate">{card.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                    {card.address && (
                        <div className="flex items-center gap-3 text-sm py-3 px-4 rounded-lg bg-neutral-900">
                            <MapPin className="size-4 text-neutral-500 shrink-0" /><span className="text-neutral-400">{card.address}</span>
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
                                    className="flex items-center gap-1.5 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-medium text-neutral-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
                                    <SocialIcon platform={link.platform} className="size-3.5" />{platform?.label}
                                </a>
                            )
                        })}
                    </div>
                )}

                <div className="flex gap-3">
                    {onContactDownload && (
                        <button onClick={onContactDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-yellow-400 text-neutral-950 rounded-lg hover:bg-yellow-300 transition-colors">
                            <Download className="size-4" />Save contact
                        </button>
                    )}
                    {onShare && (
                        <button onClick={onShare}
                            className="flex items-center justify-center border border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-300 hover:border-neutral-500 transition-colors">
                            <Share2 className="size-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
