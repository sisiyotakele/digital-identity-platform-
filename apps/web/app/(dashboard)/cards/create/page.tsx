'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CardForm } from '@/components/forms/CardForm'
import { createCard, upsertSocialLinks } from '@/lib/api/card.api'
import type { CardFormValues } from '@/lib/validations'
import type { SocialLink } from '@/lib/types'

export default function CreateCardPage() {
    const [saving, setSaving] = useState(false)
    const router = useRouter()

    async function handleSave(
        values: CardFormValues,
        photoUrl: string | null,
        logoUrl: string | null,
        socialLinks: { platform: string; url: string }[]
    ) {
        setSaving(true)
        try {
            const card = await createCard({
                slug: values.slug,
                template: values.template,
                title: values.title,
                company: values.company,
                phone: values.phone,
                email: values.email,
                website: values.website,
                address: values.address,
                bio: values.bio,
                theme_color: values.theme_color,
            })

            if (socialLinks.length > 0) {
                await upsertSocialLinks(
                    card.id,
                    socialLinks
                        .filter((l) => l.url.trim().length > 0)
                        .map((l, i) => ({
                            platform: l.platform as SocialLink['platform'],
                            url: l.url,
                            display_order: i,
                        }))
                )
            }

            if (photoUrl || logoUrl) {
                const { updateCard } = await import('@/lib/api/card.api')
                await updateCard(card.id, {
                    photo_url: photoUrl ?? undefined,
                    logo_url: logoUrl ?? undefined,
                })
            }

            toast.success('Card created')
            router.push('/cards')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to create card')
        } finally {
            setSaving(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 max-w-6xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-8">
                <Link href="/cards">
                    <Button variant="ghost" size="icon-sm">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold">Create card</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Fill in your details and choose a template</p>
                </div>
            </div>

            <CardForm onSave={handleSave} saving={saving} />
        </motion.div>
    )
}
