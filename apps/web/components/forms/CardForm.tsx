'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { CardTemplateRenderer } from '@/components/card/CardTemplateRenderer'
import { cardSchema, type CardFormValues } from '@/lib/validations'
import { generateSlug } from '@/lib/slugify'
import { checkSlugAvailable } from '@/lib/api/card.api'
import { useUpload } from '@/hooks/useUpload'
import { SOCIAL_PLATFORMS, LIMITS } from '@/lib/constants'
import type { BusinessCard, SocialLink } from '@/lib/types'

const TEMPLATES = [
    { id: 'minimal', label: 'Minimal' },
    { id: 'modern', label: 'Modern' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'creative', label: 'Creative' },
    { id: 'executive', label: 'Executive' },
    { id: 'dark', label: 'Dark' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'startup', label: 'Startup' },
] as const

interface SocialLinkEntry {
    platform: string
    url: string
}

interface CardFormProps {
    initialData?: BusinessCard
    onSave: (
        values: CardFormValues,
        photoUrl: string | null,
        logoUrl: string | null,
        socialLinks: SocialLinkEntry[]
    ) => Promise<void>
    onDelete?: () => void
    saving?: boolean
}

export function CardForm({ initialData, onSave, onDelete, saving }: CardFormProps) {
    const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
    const [checkingSlug, setCheckingSlug] = useState(false)
    const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photo_url ?? null)
    const [logoUrl, setLogoUrl] = useState<string | null>(initialData?.logo_url ?? null)
    const [showPreview, setShowPreview] = useState(false)
    const [socialLinks, setSocialLinks] = useState<SocialLinkEntry[]>(
        (initialData?.social_links ?? []).map((l) => ({ platform: l.platform, url: l.url }))
    )
    const { upload, uploading } = useUpload()

    const form = useForm<CardFormValues>({
        resolver: zodResolver(cardSchema),
        defaultValues: {
            title: initialData?.title ?? '',
            company: initialData?.company ?? '',
            slug: initialData?.slug ?? '',
            template: initialData?.template ?? 'minimal',
            phone: initialData?.phone ?? '',
            email: initialData?.email ?? '',
            website: initialData?.website ?? '',
            address: initialData?.address ?? '',
            bio: initialData?.bio ?? '',
            theme_color: initialData?.theme_color ?? '#1B4F8A',
            is_active: initialData?.is_active ?? true,
        },
    })

    const watchedValues = form.watch()

    const previewCard: BusinessCard = {
        id: initialData?.id ?? 'preview',
        user_id: '',
        slug: watchedValues.slug ?? '',
        template: watchedValues.template ?? 'minimal',
        title: watchedValues.title ?? null,
        company: watchedValues.company ?? null,
        phone: watchedValues.phone ?? null,
        email: watchedValues.email ?? null,
        website: watchedValues.website ?? null,
        address: watchedValues.address ?? null,
        bio: watchedValues.bio ?? null,
        photo_url: photoUrl,
        logo_url: logoUrl,
        theme_color: watchedValues.theme_color ?? '#1B4F8A',
        is_active: true,
        created_at: '',
        updated_at: '',
        social_links: socialLinks.map((l, i) => ({
            id: String(i),
            card_id: 'preview',
            platform: l.platform as SocialLink['platform'],
            url: l.url,
            display_order: i,
        })),
    }

    const checkSlug = useCallback(
        async (slug: string) => {
            if (slug.length < 3) { setSlugAvailable(null); return }
            setCheckingSlug(true)
            const available = await checkSlugAvailable(slug, initialData?.id)
            setSlugAvailable(available)
            setCheckingSlug(false)
        },
        [initialData?.id]
    )

    const titleValue = form.watch('title')
    useEffect(() => {
        if (titleValue && !initialData) {
            const slug = generateSlug(titleValue)
            form.setValue('slug', slug)
            checkSlug(slug)
        }
    }, [titleValue, initialData, form, checkSlug])

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const url = await upload(file, { bucket: 'card-media', folder: 'photos' })
            setPhotoUrl(url)
            toast.success('Photo uploaded')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed')
        }
    }

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const url = await upload(file, { bucket: 'card-media', folder: 'logos' })
            setLogoUrl(url)
            toast.success('Logo uploaded')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed')
        }
    }

    async function onSubmit(values: CardFormValues) {
        if (slugAvailable === false) {
            toast.error('This slug is already taken')
            return
        }
        await onSave(values, photoUrl, logoUrl, socialLinks)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                            <h2 className="font-semibold text-base">Basic information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name / Title</FormLabel>
                                        <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="company" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="bio" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl><Textarea placeholder="A short description..." rows={3} {...field} /></FormControl>
                                    <FormDescription>{(field.value ?? '').length}/{LIMITS.MAX_BIO_LENGTH}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card URL slug</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="my-card"
                                                {...field}
                                                onChange={(e) => { field.onChange(e); checkSlug(e.target.value) }}
                                            />
                                            {checkingSlug && (
                                                <Loader2 className="absolute right-3 top-2 size-4 animate-spin text-muted-foreground" />
                                            )}
                                        </div>
                                    </FormControl>
                                    {slugAvailable === true && !checkingSlug && <p className="text-xs text-green-600">Slug is available</p>}
                                    {slugAvailable === false && !checkingSlug && <p className="text-xs text-destructive">This slug is already taken</p>}
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                            <h2 className="font-semibold text-base">Contact details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" placeholder="jane@acme.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl><Input type="tel" placeholder="+1 234 567 8900" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="website" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl><Input type="url" placeholder="https://jane.dev" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                            <h2 className="font-semibold text-base">Photos</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Profile photo</p>
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="size-6 text-muted-foreground mx-auto mb-1" />
                                                <span className="text-xs text-muted-foreground">Upload photo</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
                                    </label>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-2">Company logo</p>
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="size-6 text-muted-foreground mx-auto mb-1" />
                                                <span className="text-xs text-muted-foreground">Upload logo</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                            <h2 className="font-semibold text-base">Social links</h2>
                            {socialLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <GripVertical className="size-4 text-muted-foreground shrink-0" />
                                    <select
                                        value={link.platform}
                                        onChange={(e) => {
                                            const updated = [...socialLinks]
                                            updated[index] = { ...updated[index], platform: e.target.value }
                                            setSocialLinks(updated)
                                        }}
                                        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        {SOCIAL_PLATFORMS.map((p) => (
                                            <option key={p.id} value={p.id}>{p.label}</option>
                                        ))}
                                    </select>
                                    <Input
                                        value={link.url}
                                        onChange={(e) => {
                                            const updated = [...socialLinks]
                                            updated[index] = { ...updated[index], url: e.target.value }
                                            setSocialLinks(updated)
                                        }}
                                        placeholder={SOCIAL_PLATFORMS.find((p) => p.id === link.platform)?.placeholder ?? 'https://'}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="ghost" size="icon-sm"
                                        onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            {socialLinks.length < LIMITS.MAX_SOCIAL_LINKS_PER_CARD && (
                                <Button type="button" variant="outline" size="sm"
                                    onClick={() => setSocialLinks([...socialLinks, { platform: 'linkedin', url: '' }])}>
                                    <Plus className="size-4 mr-1.5" />Add link
                                </Button>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                            <h2 className="font-semibold text-base">Appearance</h2>
                            <FormField control={form.control} name="template" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Template</FormLabel>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                        {TEMPLATES.map((t) => (
                                            <button key={t.id} type="button" onClick={() => field.onChange(t.id)}
                                                className={`border-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors text-center ${field.value === t.id
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-border hover:border-foreground/30'
                                                    }`}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="theme_color" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accent color</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-3">
                                            <input type="color" {...field} className="size-10 rounded-lg border border-input cursor-pointer" />
                                            <Input value={field.value} onChange={field.onChange} placeholder="#1B4F8A" className="w-32 font-mono" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {initialData && (
                                <FormField control={form.control} name="is_active" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                                        <div>
                                            <FormLabel>Card active</FormLabel>
                                            <FormDescription className="text-xs">Active cards are publicly visible</FormDescription>
                                        </div>
                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={field.value}
                                            onClick={() => field.onChange(!field.value)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${field.value ? 'bg-primary' : 'bg-input'}`}
                                        >
                                            <span className={`inline-block size-4 rounded-full bg-white transition-transform shadow ${field.value ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </FormItem>
                                )} />
                            )}
                        </div>

                        <div className="flex items-center justify-between pb-8">
                            <div className="flex gap-3">
                                <Button type="submit" disabled={saving || uploading}>
                                    {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                                    {initialData ? 'Save changes' : 'Create card'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
                                    {showPreview ? 'Hide preview' : 'Preview'}
                                </Button>
                            </div>
                            {onDelete && (
                                <Button type="button" variant="destructive" onClick={onDelete}>Delete card</Button>
                            )}
                        </div>
                    </div>

                    <div className={`w-full lg:w-96 lg:sticky lg:top-6 lg:self-start ${showPreview ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                <span className="text-sm font-medium">Live preview</span>
                                <Badge variant="outline" className="text-xs">{watchedValues.template ?? 'minimal'}</Badge>
                            </div>
                            <div className="max-h-[700px] overflow-y-auto">
                                <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', minHeight: '400px' }}>
                                    <CardTemplateRenderer card={previewCard} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
