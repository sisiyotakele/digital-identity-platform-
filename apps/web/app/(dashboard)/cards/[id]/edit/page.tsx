'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { CardForm } from '@/components/forms/CardForm'
import { fetchCard, updateCard, deleteCard, upsertSocialLinks } from '@/lib/api/card.api'
import type { CardFormValues } from '@/lib/validations'
import type { BusinessCard, SocialLink } from '@/lib/types'

export default function EditCardPage() {
    const { id } = useParams<{ id: string }>()
    const [card, setCard] = useState<BusinessCard | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchCard(id)
            .then(setCard)
            .catch(() => toast.error('Card not found'))
            .finally(() => setLoading(false))
    }, [id])

    async function handleSave(
        values: CardFormValues,
        photoUrl: string | null,
        logoUrl: string | null,
        socialLinks: { platform: string; url: string }[]
    ) {
        setSaving(true)
        try {
            await updateCard(id, {
                ...values,
                photo_url: photoUrl ?? undefined,
                logo_url: logoUrl ?? undefined,
            })

            await upsertSocialLinks(
                id,
                socialLinks.map((l, i) => ({
                    platform: l.platform as SocialLink['platform'],
                    url: l.url,
                    display_order: i,
                }))
            )

            toast.success('Card updated')
            router.push('/cards')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update card')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        setDeleting(true)
        try {
            await deleteCard(id)
            toast.success('Card deleted')
            router.push('/cards')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to delete card')
            setDeleting(false)
            setConfirmDelete(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        )
    }

    if (!card) {
        return (
            <div className="p-6 md:p-8 text-center">
                <p className="text-muted-foreground">Card not found</p>
                <Link href="/cards"><Button className="mt-4" variant="outline">Back to cards</Button></Link>
            </div>
        )
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
                    <h1 className="text-2xl font-semibold">Edit card</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">/{card.slug}</p>
                </div>
            </div>

            <CardForm
                initialData={card}
                onSave={handleSave}
                onDelete={() => setConfirmDelete(true)}
                saving={saving}
            />

            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete card</DialogTitle>
                        <DialogDescription>
                            This will permanently delete{' '}
                            <span className="font-medium text-foreground">{card.title ?? card.slug}</span>{' '}
                            and all its analytics data. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete forever'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
