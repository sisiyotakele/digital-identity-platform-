'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Camera, Moon, Sun, Shield, Bell } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { fetchCurrentProfile, updateProfile, checkUsernameAvailable } from '@/lib/api/user.api'
import { createClient } from '@/lib/supabase/client'
import { useUpload } from '@/hooks/useUpload'
import { settingsProfileSchema, changePasswordSchema, type SettingsProfileFormValues, type ChangePasswordFormValues } from '@/lib/validations'
import { getInitials } from '@/lib/constants'
import { siteConfig } from '@/config/site'
import type { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingPassword, setSavingPassword] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState('')
    const [mounted, setMounted] = useState(false)
    const { upload, uploading } = useUpload()
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    useEffect(() => { setMounted(true) }, [])

    const profileForm = useForm<SettingsProfileFormValues>({
        resolver: zodResolver(settingsProfileSchema),
        defaultValues: { display_name: '', username: '' },
    })

    const passwordForm = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    })

    useEffect(() => {
        fetchCurrentProfile().then((p) => {
            setProfile(p)
            if (p) profileForm.reset({ display_name: p.display_name ?? '', username: p.username ?? '' })
        }).finally(() => setLoading(false))
    }, [])

    async function checkUsername(username: string) {
        if (!username || username === profile?.username) { setUsernameAvailable(null); return }
        if (username.length < 3) { setUsernameAvailable(null); return }
        setCheckingUsername(true)
        const available = await checkUsernameAvailable(username, profile?.id)
        setUsernameAvailable(available)
        setCheckingUsername(false)
    }

    async function onSaveProfile(values: SettingsProfileFormValues) {
        if (usernameAvailable === false) { toast.error('Username is already taken'); return }
        setSaving(true)
        try {
            const updated = await updateProfile({ display_name: values.display_name, username: values.username })
            setProfile(updated)
            toast.success('Profile updated')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update profile')
        } finally { setSaving(false) }
    }

    async function onChangePassword(values: ChangePasswordFormValues) {
        setSavingPassword(true)
        const supabase = createClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: (await supabase.auth.getUser()).data.user?.email ?? '',
            password: values.currentPassword,
        })
        if (signInError) { toast.error('Current password is incorrect'); setSavingPassword(false); return }
        const { error } = await supabase.auth.updateUser({ password: values.newPassword })
        setSavingPassword(false)
        if (error) { toast.error(error.message); return }
        toast.success('Password updated')
        passwordForm.reset()
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const url = await upload(file, { bucket: 'avatars' })
            await updateProfile({ avatar_url: url })
            setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev)
            toast.success('Avatar updated')
        } catch (err) { toast.error(err instanceof Error ? err.message : 'Upload failed') }
    }

    async function handleDeleteAccount() {
        if (deleteConfirm !== 'DELETE') return
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('business_cards').delete().eq('user_id', user.id)
        await supabase.from('profiles').delete().eq('id', user.id)
        await supabase.auth.signOut()
        router.push('/')
    }

    const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={cn('bg-card border border-border rounded-2xl p-6 space-y-6', className)}>
            {children}
        </div>
    )

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h2 className="font-bold text-base text-foreground">{children}</h2>
    )

    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <div className="h-5 bg-muted rounded w-32 animate-pulse" />
                        <div className="h-9 bg-muted rounded animate-pulse" />
                        <div className="h-9 bg-muted rounded animate-pulse" />
                    </div>
                ))}
            </div>
        )
    }

    const displayName = profile?.display_name ?? ''
    const initials = displayName ? getInitials(displayName) : '?'

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 max-w-2xl mx-auto space-y-5"
        >
            <div>
                <h1 className="text-2xl font-black text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile section */}
            <Section>
                <SectionTitle>Profile</SectionTitle>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar size="lg">
                            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <label className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors shadow">
                            <Camera className="size-3 text-primary-foreground" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        </label>
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-foreground">{displayName || 'No name set'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Click the camera icon to change photo</p>
                    </div>
                </div>

                <Separator />

                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                        <FormField control={profileForm.control} name="display_name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-semibold">Display name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Abel Abebe"
                                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={profileForm.control} name="username" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-foreground font-semibold">Username</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-sm text-muted-foreground font-medium">@</span>
                                        <Input
                                            className="pl-7 bg-background border-border text-foreground placeholder:text-muted-foreground"
                                            placeholder="abelabebe"
                                            {...field}
                                            onChange={(e) => { field.onChange(e); checkUsername(e.target.value) }}
                                        />
                                        {checkingUsername && <Loader2 className="absolute right-3 top-2 size-4 animate-spin text-muted-foreground" />}
                                    </div>
                                </FormControl>
                                {field.value && field.value !== profile?.username && (
                                    <FormDescription className={usernameAvailable === false ? 'text-destructive' : usernameAvailable ? 'text-emerald-500' : 'text-muted-foreground'}>
                                        {usernameAvailable === true && '✓ Username is available'}
                                        {usernameAvailable === false && '✗ Username is already taken'}
                                        {usernameAvailable === null && field.value && `${siteConfig.url}/${field.value}`}
                                    </FormDescription>
                                )}
                                {field.value === profile?.username && field.value && (
                                    <FormDescription className="text-muted-foreground">{siteConfig.url}/{field.value}</FormDescription>
                                )}
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90">
                            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Save profile
                        </Button>
                    </form>
                </Form>
            </Section>

            {/* Appearance section */}
            {mounted && (
                <Section>
                    <SectionTitle>Appearance</SectionTitle>
                    <p className="text-sm text-muted-foreground -mt-4">Choose how the app looks</p>
                    <div className="grid grid-cols-2 gap-3">
                        {(['light', 'dark'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={cn(
                                    'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all',
                                    theme === t
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/40 bg-card'
                                )}
                            >
                                <div className={cn(
                                    'size-10 rounded-xl flex items-center justify-center',
                                    t === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                )}>
                                    {t === 'dark'
                                        ? <Moon className="size-5 text-blue-400" />
                                        : <Sun className="size-5 text-amber-500" />}
                                </div>
                                <span className="text-sm font-semibold capitalize text-foreground">{t} mode</span>
                                {theme === t && <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Active</span>}
                            </button>
                        ))}
                    </div>
                </Section>
            )}

            {/* Change password */}
            <Section>
                <SectionTitle>Change password</SectionTitle>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((name) => (
                            <FormField key={name} control={passwordForm.control} name={name} render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground font-semibold capitalize">
                                        {name === 'currentPassword' ? 'Current password'
                                            : name === 'newPassword' ? 'New password'
                                                : 'Confirm new password'}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="bg-background border-border text-foreground"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        ))}
                        <Button type="submit" disabled={savingPassword} variant="outline">
                            {savingPassword && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Update password
                        </Button>
                    </form>
                </Form>
            </Section>

            {/* Danger zone */}
            <div className="bg-card border border-destructive/30 rounded-2xl p-6 space-y-4">
                <div>
                    <h2 className="font-bold text-base text-destructive">Danger zone</h2>
                    <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all data.</p>
                </div>
                <Button variant="destructive" onClick={() => setDeleteDialog(true)}>Delete account</Button>
            </div>

            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete your account</DialogTitle>
                        <DialogDescription>
                            This permanently deletes all your cards, analytics, and leads. Type{' '}
                            <span className="font-mono font-bold text-foreground">DELETE</span> to confirm.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="bg-background border-border text-foreground"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirm !== 'DELETE'}>
                            Delete account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
