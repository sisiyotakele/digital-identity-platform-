'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormValues } from '@/lib/validations'
import { siteConfig } from '@/config/site'

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    })

    async function onSubmit(values: RegisterFormValues) {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                data: { full_name: values.fullName },
                emailRedirectTo: `${window.location.origin}/verify-email`,
            },
        })

        if (error) {
            setLoading(false)
            if (error.message.includes('already registered')) {
                toast.error('An account with this email already exists')
            } else {
                toast.error(error.message)
            }
            return
        }

        toast.success('Account created — check your email to verify')
        router.push('/verify-email')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">{siteConfig.name}</h1>
                <p className="text-sm text-muted-foreground">Create your account</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jane Doe" autoComplete="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Repeat your password"
                                            autoComplete="new-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Create account
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-xs text-muted-foreground">
                    By creating an account you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-foreground">
                        Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="underline hover:text-foreground">
                        Privacy Policy
                    </Link>
                </p>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="text-foreground font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
