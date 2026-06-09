'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Users, Download, Share2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CardTemplateRenderer } from './CardTemplateRenderer'
import { trackEvent, detectDeviceType } from '@/lib/analytics'
import { submitLead } from '@/lib/api/analytics.api'
import { siteConfig } from '@/config/site'
import { leadSchema, type LeadFormValues } from '@/lib/validations'
import type { BusinessCard } from '@/lib/types'

interface CardPublicViewProps {
    card: BusinessCard
    username: string
}

export function CardPublicView({ card, username }: CardPublicViewProps) {
    const [leadSubmitted, setLeadSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        trackEvent({
            card_id: card.id,
            event_type: 'card_view',
            device_type: detectDeviceType(),
        })
    }, [card.id])

    function handleContactDownload() {
        trackEvent({ card_id: card.id, event_type: 'contact_download' })
        // Direct link — browser handles the download via Content-Disposition header
        const a = document.createElement('a')
        a.href = `/api/vcard?slug=${encodeURIComponent(card.slug)}&username=${encodeURIComponent(username)}`
        a.download = `${card.title ?? 'contact'}.vcf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success('Contact saved to your device')
    }

    function handleShare() {
        trackEvent({ card_id: card.id, event_type: 'share_click' })
        const url = `${siteConfig.url}/${username}/${card.slug}`
        if (navigator.share) {
            navigator.share({ title: card.title ?? 'Digital Card', text: `${card.title} — ${card.company ?? ''}`, url })
        } else {
            navigator.clipboard.writeText(url)
            toast.success('Link copied to clipboard')
        }
    }

    function handleLinkClick(platform: string) {
        trackEvent({ card_id: card.id, event_type: 'link_click', link_platform: platform })
    }

    function handleEmailClick() {
        trackEvent({ card_id: card.id, event_type: 'email_click' })
    }

    function handlePhoneClick() {
        trackEvent({ card_id: card.id, event_type: 'phone_click' })
    }

    function handleWebsiteClick() {
        trackEvent({ card_id: card.id, event_type: 'website_click' })
    }

    const leadForm = useForm<LeadFormValues>({
        resolver: zodResolver(leadSchema),
        defaultValues: { name: '', email: '', phone: '', message: '' },
    })

    async function onLeadSubmit(values: LeadFormValues) {
        setSubmitting(true)
        try {
            await submitLead({
                card_id: card.id,
                name: values.name,
                email: values.email || undefined,
                phone: values.phone || undefined,
                message: values.message || undefined,
            })
            setLeadSubmitted(true)
            toast.success('Your details have been sent')
        } catch {
            toast.error('Failed to send — please try again')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen">
            <CardTemplateRenderer
                card={card}
                onContactDownload={handleContactDownload}
                onShare={handleShare}
                onLinkClick={handleLinkClick}
                onEmailClick={handleEmailClick}
                onPhoneClick={handlePhoneClick}
                onWebsiteClick={handleWebsiteClick}
            />

            {/* Sticky download bar at bottom on mobile */}
            <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-border px-4 py-3 flex gap-3 md:hidden">
                <Button
                    onClick={handleContactDownload}
                    className="flex-1 gap-2 font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 h-11"
                >
                    <Download className="size-4" />
                    Save Contact
                </Button>
                <Button onClick={handleShare} variant="outline" className="h-11 w-11 p-0">
                    <Share2 className="size-4" />
                </Button>
            </div>

            {/* Lead capture section */}
            <div className="max-w-sm mx-auto px-6 py-10 pb-20 md:pb-10 border-t border-border">
                <div className="text-center mb-6">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center mx-auto mb-3">
                        <Users className="size-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-base">Connect with {card.title?.split(' ')[0] ?? 'me'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Leave your details and they will reach out
                    </p>
                </div>

                {leadSubmitted ? (
                    <div className="text-center py-8 space-y-3">
                        <CheckCircle2 className="size-12 text-emerald-500 mx-auto" />
                        <p className="font-semibold">Details sent!</p>
                        <p className="text-sm text-muted-foreground">
                            {card.title?.split(' ')[0] ?? 'They'} will get back to you soon.
                        </p>
                    </div>
                ) : (
                    <Form {...leadForm}>
                        <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
                            <FormField control={leadForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dawit Bekele" className="h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="dawit@company.com.et" className="h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="+251 91 234 5678" className="h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="message" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message <span className="text-muted-foreground font-normal text-xs">(optional)</span></FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="I would love to connect…" rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button
                                type="submit"
                                className="w-full h-11 font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90"
                                disabled={submitting}
                            >
                                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Send my details
                            </Button>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    )
}
