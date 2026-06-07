'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormValues } from '@/lib/validations'
import { siteConfig } from '@/config/site'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    })

    async function onSubmit(values: LoginFormValues) {
        setLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })

        if (error) {
            setLoading(false)
            if (error.message.includes('Email not confirmed')) {
                toast.error('Please verify your email before logging in')
            } else if (error.message.includes('Invalid login credentials')) {
                toast.error('Incorrect email or password')
            } else {
                toast.error(error.message)
            }
            return
        }

        toast.success('Welcome back')
        router.push(redirectTo)
        router.refresh()
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
                <p className="text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8 space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            Sign in
                        </Button>
                    </form>
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    No account yet?{' '}
                    <Link href="/register" className="text-foreground font-medium hover:underline">
                        Create one
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
