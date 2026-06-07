'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Users } from 'lucide-react'
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
        window.location.href = `/api/vcard?slug=${card.slug}&username=${username}`
    }

    function handleShare() {
        trackEvent({ card_id: card.id, event_type: 'share_click' })
        const url = `${siteConfig.url}/${username}/${card.slug}`
        if (navigator.share) {
            navigator.share({ title: card.title ?? '', url })
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
            toast.success('Message sent')
        } catch {
            toast.error('Failed to send message')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <CardTemplateRenderer
                card={card}
                onContactDownload={handleContactDownload}
                onShare={handleShare}
                onLinkClick={handleLinkClick}
                onEmailClick={handleEmailClick}
                onPhoneClick={handlePhoneClick}
                onWebsiteClick={handleWebsiteClick}
            />

            <div className="max-w-sm mx-auto px-6 py-10 border-t border-border">
                <div className="text-center mb-6">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <Users className="size-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base">Leave your details</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {card.title ?? 'This person'} will get back to you
                    </p>
                </div>

                {leadSubmitted ? (
                    <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">
                            Thanks — your details have been shared.
                        </p>
                    </div>
                ) : (
                    <Form {...leadForm}>
                        <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-4">
                            <FormField control={leadForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your name</FormLabel>
                                    <FormControl><Input placeholder="John Smith" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                                    <FormControl><Input type="email" placeholder="john@email.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                                    <FormControl><Input type="tel" placeholder="+1 234 567 8900" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={leadForm.control} name="message" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                                    <FormControl><Textarea placeholder="I would love to connect…" rows={3} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Button type="submit" className="w-full" disabled={submitting}>
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
