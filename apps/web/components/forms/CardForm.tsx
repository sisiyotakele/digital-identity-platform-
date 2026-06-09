'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Trash2, Loader2, Camera, Upload, CheckCircle2,
    Smartphone, QrCode, GripVertical, ChevronDown, ChevronUp,
    Globe, Phone, Mail, MapPin, Linkedin, Github, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Form, FormControl, FormField, FormItem, FormLabel,
    FormMessage, FormDescription
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { CardTemplateRenderer } from '@/components/card/CardTemplateRenderer'
import { cardSchema, type CardFormValues } from '@/lib/validations'
import { generateSlug } from '@/lib/slugify'
import { checkSlugAvailable } from '@/lib/api/card.api'
import { useUpload } from '@/hooks/useUpload'
import { SOCIAL_PLATFORMS, LIMITS } from '@/lib/constants'
import type { BusinessCard, SocialLink } from '@/lib/types'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const TEMPLATES = [
    { id: 'minimal', label: 'Minimal', accent: '#6B7280' },
    { id: 'modern', label: 'Modern', accent: '#3B82F6' },
    { id: 'corporate', label: 'Corporate', accent: '#1B4F8A' },
    { id: 'creative', label: 'Creative', accent: '#7C3AED' },
    { id: 'executive', label: 'Executive', accent: '#92400E' },
    { id: 'dark', label: 'Dark', accent: '#22D3EE' },
    { id: 'gradient', label: 'Gradient', accent: '#6366F1' },
    { id: 'startup', label: 'Startup', accent: '#10B981' },
] as const

interface SocialLinkEntry { platform: string; url: string }

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
    const [photoUploading, setPhotoUploading] = useState(false)
    const [logoUploading, setLogoUploading] = useState(false)
    const [socialLinks, setSocialLinks] = useState<SocialLinkEntry[]>(
        (initialData?.social_links ?? []).map((l) => ({ platform: l.platform, url: l.url }))
    )
    const [activeSection, setActiveSection] = useState<string>('identity')
    const [showQR, setShowQR] = useState(false)
    const [autoSaved, setAutoSaved] = useState(false)
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { upload } = useUpload()

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
            theme_color: initialData?.theme_color ?? '#3B82F6',
            is_active: initialData?.is_active ?? true,
        },
    })

    const watchedValues = form.watch()

    const previewCard: BusinessCard = {
        id: initialData?.id ?? 'preview',
        user_id: '',
        slug: watchedValues.slug ?? '',
        template: watchedValues.template ?? 'modern',
        title: watchedValues.title || null,
        company: watchedValues.company || null,
        phone: watchedValues.phone || null,
        email: watchedValues.email || null,
        website: watchedValues.website || null,
        address: watchedValues.address || null,
        bio: watchedValues.bio || null,
        photo_url: photoUrl,
        logo_url: logoUrl,
        theme_color: watchedValues.theme_color ?? '#3B82F6',
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

    const checkSlug = useCallback(async (slug: string) => {
        if (slug.length < 3) { setSlugAvailable(null); return }
        setCheckingSlug(true)
        const available = await checkSlugAvailable(slug, initialData?.id)
        setSlugAvailable(available)
        setCheckingSlug(false)
    }, [initialData?.id])

    const titleValue = form.watch('title')
    useEffect(() => {
        if (titleValue && !initialData) {
            const slug = generateSlug(titleValue)
            form.setValue('slug', slug)
            checkSlug(slug)
        }
    }, [titleValue, initialData, form, checkSlug])

    useEffect(() => {
        if (!initialData) return
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
        autoSaveTimer.current = setTimeout(() => {
            setAutoSaved(true)
            setTimeout(() => setAutoSaved(false), 2000)
        }, 3000)
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
    }, [watchedValues, photoUrl, logoUrl, socialLinks, initialData])

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setPhotoUploading(true)
        try {
            const url = await upload(file, { bucket: 'card-media', folder: 'photos' })
            setPhotoUrl(url)
            toast.success('Profile photo uploaded')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Photo upload failed')
        } finally {
            setPhotoUploading(false)
            e.target.value = ''
        }
    }

    async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setLogoUploading(true)
        try {
            const url = await upload(file, { bucket: 'card-media', folder: 'logos' })
            setLogoUrl(url)
            toast.success('Company logo uploaded')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Logo upload failed')
        } finally {
            setLogoUploading(false)
            e.target.value = ''
        }
    }

    async function onSubmit(values: CardFormValues) {
        if (slugAvailable === false) {
            toast.error('This slug is already taken')
            return
        }
        await onSave(values, photoUrl, logoUrl, socialLinks)
    }

    const cardUrl = `${siteConfig.url}/${initialData?.user_id ? '' : 'preview'}${watchedValues.slug ?? ''}`

    const sections = [
        { id: 'identity', label: 'Identity' },
        { id: 'social', label: 'Social & Links' },
        { id: 'appearance', label: 'Appearance' },
    ]

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">

                    {/* ── Left Column: Editor ───────────────────────────── */}
                    <div className="space-y-4">

                        {/* Section tabs */}
                        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveSection(s.id)}
                                    className={cn(
                                        'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                                        activeSection === s.id
                                            ? 'bg-card text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* ── IDENTITY SECTION ─────────────────────────────── */}
                        <AnimatePresence mode="wait">
                            {activeSection === 'identity' && (
                                <motion.div
                                    key="identity"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-card border border-border rounded-2xl p-6 space-y-6"
                                >
                                    {/* Photo + Logo upload */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            Theme Color
                                        </p>
                                        <div className="flex items-center gap-4 mb-6">
                                            <FormField control={form.control} name="theme_color" render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-full h-11 rounded-xl border-2 border-border cursor-pointer relative overflow-hidden group"
                                                                style={{ backgroundColor: field.value }}
                                                            >
                                                                <input
                                                                    type="color"
                                                                    {...field}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                                    <p className="text-white text-xs font-mono opacity-0 group-hover:opacity-100 drop-shadow">
                                                                        {field.value}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Photo Upload */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                    Photo
                                                </p>
                                                <label className={cn(
                                                    'relative flex flex-col items-center justify-center h-28 rounded-xl cursor-pointer transition-all overflow-hidden border-2',
                                                    photoUploading
                                                        ? 'border-primary/50 bg-primary/5'
                                                        : photoUrl
                                                            ? 'border-transparent'
                                                            : 'border-dashed border-border hover:border-primary hover:bg-primary/5'
                                                )}>
                                                    {photoUploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loader2 className="size-6 animate-spin text-primary" />
                                                            <p className="text-xs text-primary">Uploading…</p>
                                                        </div>
                                                    ) : photoUrl ? (
                                                        <>
                                                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                                                <Camera className="size-5 text-white" />
                                                                <p className="text-white text-xs">Change photo</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 p-4">
                                                            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                                                                <Camera className="size-5 text-muted-foreground" />
                                                            </div>
                                                            <p className="text-xs text-muted-foreground text-center">Click to upload photo</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={handlePhotoUpload}
                                                        disabled={photoUploading}
                                                    />
                                                </label>
                                            </div>

                                            {/* Logo Upload */}
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                    Logo
                                                </p>
                                                <label className={cn(
                                                    'relative flex flex-col items-center justify-center h-28 rounded-xl cursor-pointer transition-all overflow-hidden border-2',
                                                    logoUploading
                                                        ? 'border-primary/50 bg-primary/5'
                                                        : logoUrl
                                                            ? 'border-border bg-muted/30'
                                                            : 'border-dashed border-border hover:border-primary hover:bg-primary/5'
                                                )}>
                                                    {logoUploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loader2 className="size-6 animate-spin text-primary" />
                                                            <p className="text-xs text-primary">Uploading…</p>
                                                        </div>
                                                    ) : logoUrl ? (
                                                        <>
                                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                                                                <Upload className="size-5 text-white" />
                                                                <p className="text-white text-xs">Change logo</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 p-4">
                                                            <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                                                                <Upload className="size-5 text-muted-foreground" />
                                                            </div>
                                                            <p className="text-xs text-muted-foreground text-center">Click to upload logo</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/jpeg,image/png,image/webp"
                                                        onChange={handleLogoUpload}
                                                        disabled={logoUploading}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Name + Job Title */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="title" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Abel Abebe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="company" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Company
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="UNIQUE Digital Card" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Phone + Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Phone
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                                        <Input className="pl-8" type="tel" placeholder="+251 91 234 5678" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="email" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                                        <Input className="pl-8" type="email" placeholder="abel@company.com.et" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Website + Address */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField control={form.control} name="website" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Website
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                                        <Input className="pl-8" type="url" placeholder="https://company.com.et" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="address" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                    Location
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                                                        <Input className="pl-8" placeholder="Bole, Addis Ababa" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    {/* Bio */}
                                    <FormField control={form.control} name="bio" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                Bio
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="A short description about yourself..."
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-right">
                                                {(field.value ?? '').length}/{LIMITS.MAX_BIO_LENGTH}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {/* Slug */}
                                    <FormField control={form.control} name="slug" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                                Card URL
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="font-mono text-sm"
                                                    placeholder="my-card"
                                                    {...field}
                                                    onChange={(e) => { field.onChange(e); checkSlug(e.target.value) }}
                                                />
                                            </FormControl>
                                            {field.value && (
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {siteConfig.url}/{field.value}
                                                </p>
                                            )}
                                            {slugAvailable === true && !checkingSlug && (
                                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 className="size-3" /> Available
                                                </p>
                                            )}
                                            {slugAvailable === false && !checkingSlug && (
                                                <p className="text-xs text-destructive">This slug is already taken</p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {/* Active toggle (edit only) */}
                                    {initialData && (
                                        <FormField control={form.control} name="is_active" render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-xl border border-border p-4 bg-muted/30">
                                                <div>
                                                    <FormLabel className="text-sm font-medium">Card visible</FormLabel>
                                                    <FormDescription className="text-xs">Public can view this card at its URL</FormDescription>
                                                </div>
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={field.value}
                                                    onClick={() => field.onChange(!field.value)}
                                                    className={cn(
                                                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                                        field.value ? 'bg-primary' : 'bg-input'
                                                    )}
                                                >
                                                    <span className={cn(
                                                        'inline-block size-4 rounded-full bg-white transition-transform shadow-sm',
                                                        field.value ? 'translate-x-6' : 'translate-x-1'
                                                    )} />
                                                </button>
                                            </FormItem>
                                        )} />
                                    )}
                                </motion.div>
                            )}

                            {/* ── SOCIAL & LINKS SECTION ────────────────────────── */}
                            {activeSection === 'social' && (
                                <motion.div
                                    key="social"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-card border border-border rounded-2xl p-6 space-y-4"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Social Profiles & Links
                                    </p>

                                    {socialLinks.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                                            <Share2 className="size-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">No links added yet</p>
                                        </div>
                                    )}

                                    {socialLinks.map((link, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <GripVertical className="size-4 text-muted-foreground shrink-0 cursor-grab" />
                                            <select
                                                value={link.platform}
                                                onChange={(e) => {
                                                    const updated = [...socialLinks]
                                                    updated[index] = { ...updated[index], platform: e.target.value }
                                                    setSocialLinks(updated)
                                                }}
                                                className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
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
                                                className="flex-1 font-mono text-sm"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 className="size-4 text-muted-foreground hover:text-destructive transition-colors" />
                                            </Button>
                                        </motion.div>
                                    ))}

                                    {socialLinks.length < LIMITS.MAX_SOCIAL_LINKS_PER_CARD && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSocialLinks([...socialLinks, { platform: 'linkedin', url: '' }])}
                                            className="w-full"
                                        >
                                            <Plus className="size-4 mr-1.5" />
                                            Add social link
                                        </Button>
                                    )}
                                </motion.div>
                            )}

                            {/* ── APPEARANCE SECTION ───────────────────────────── */}
                            {activeSection === 'appearance' && (
                                <motion.div
                                    key="appearance"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-card border border-border rounded-2xl p-6 space-y-6"
                                >
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                            Template
                                        </p>
                                        <FormField control={form.control} name="template" render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {TEMPLATES.map((t) => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => field.onChange(t.id)}
                                                            className={cn(
                                                                'relative rounded-xl overflow-hidden border-2 transition-all group',
                                                                field.value === t.id
                                                                    ? 'border-primary shadow-md scale-[1.02]'
                                                                    : 'border-border hover:border-primary/50'
                                                            )}
                                                        >
                                                            <div className="h-16 flex flex-col">
                                                                <div
                                                                    className="h-8"
                                                                    style={{ background: `linear-gradient(135deg, ${t.accent}cc, ${t.accent})` }}
                                                                />
                                                                <div className="flex-1 bg-card px-2 pt-1">
                                                                    <div className="h-1.5 bg-muted rounded w-3/4 mb-1" />
                                                                    <div className="h-1 bg-muted rounded w-1/2" />
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-medium text-center py-1.5 border-t border-border bg-card">
                                                                {t.label}
                                                            </p>
                                                            {field.value === t.id && (
                                                                <div className="absolute top-1 right-1">
                                                                    <CheckCircle2 className="size-4 text-primary" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Save / Delete buttons */}
                        <div className="flex items-center justify-between pt-2 pb-8">
                            <div className="flex gap-3">
                                <Button type="submit" disabled={saving} className="gap-2 shadow-sm">
                                    {saving
                                        ? <><Loader2 className="size-4 animate-spin" />Saving…</>
                                        : initialData ? 'Save changes' : 'Create card'
                                    }
                                </Button>
                            </div>
                            {onDelete && (
                                <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                                    Delete card
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* ── Right Column: Phone Preview ───────────────────── */}
                    <div className="hidden xl:block">
                        <div className="sticky top-20">
                            {/* Auto-save indicator */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Live Preview</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AnimatePresence>
                                        {autoSaved && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full"
                                            >
                                                <CheckCircle2 className="size-3" />
                                                Auto-saved
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        type="button"
                                        onClick={() => setShowQR(!showQR)}
                                        className={cn(
                                            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors',
                                            showQR
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-border text-muted-foreground hover:border-foreground'
                                        )}
                                    >
                                        <QrCode className="size-3" />
                                        QR
                                    </button>
                                </div>
                            </div>

                            {/* Phone mockup */}
                            <div className="relative mx-auto w-[280px]">
                                {/* Phone frame */}
                                <div className="absolute inset-0 rounded-[2.8rem] bg-gray-900 shadow-2xl" />
                                <div className="absolute inset-[3px] rounded-[2.5rem] bg-black" />

                                {/* Notch */}
                                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-20" />

                                {/* Screen */}
                                <div className="relative z-10 mx-[3px] rounded-[2.5rem] overflow-hidden bg-white" style={{ minHeight: 560 }}>
                                    {showQR ? (
                                        <div className="flex flex-col items-center justify-center h-full p-8 gap-4 bg-white" style={{ minHeight: 560 }}>
                                            <div className="text-center mb-2">
                                                <p className="font-semibold text-gray-900">{watchedValues.title || 'Abel Abebe'}</p>
                                                <p className="text-xs text-gray-500">{watchedValues.company || ''}</p>
                                            </div>
                                            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <QRCodeDisplay url={cardUrl} />
                                            </div>
                                            <p className="text-xs text-gray-400 text-center break-all px-4">{cardUrl}</p>
                                        </div>
                                    ) : (
                                        <div
                                            className="overflow-y-auto pointer-events-none select-none"
                                            style={{ minHeight: 560, maxHeight: 560 }}
                                        >
                                            <div style={{ transform: 'scale(0.72)', transformOrigin: 'top center', width: '138.9%', marginLeft: '-19.4%' }}>
                                                <CardTemplateRenderer card={previewCard} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Home indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full z-20" />
                            </div>

                            {/* Template badge */}
                            <div className="flex justify-center mt-4">
                                <Badge variant="outline" className="text-xs">
                                    {watchedValues.template ?? 'modern'} template
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

function QRCodeDisplay({ url }: { url: string }) {
    const [src, setSrc] = useState<string | null>(null)

    useEffect(() => {
        import('qrcode').then((QRCode) => {
            QRCode.toDataURL(url || 'https://example.com', {
                width: 160,
                margin: 1,
                color: { dark: '#111827', light: '#FFFFFF' },
            }).then(setSrc)
        })
    }, [url])

    if (!src) return <div className="size-40 bg-muted animate-pulse rounded-lg" />
    return <img src={src} alt="QR code" width={160} height={160} className="rounded-lg" />
}
