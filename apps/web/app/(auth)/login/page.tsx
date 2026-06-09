'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormValues } from '@/lib/validations'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
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

        toast.success('Welcome back!')
        router.push(redirectTo)
        router.refresh()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
        >
            <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sign in to your UNIQUE account
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7 shadow-sm space-y-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="abel@company.com.et"
                                        autoComplete="email"
                                        className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between mb-1.5">
                                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</FormLabel>
                                    <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pr-10 focus-visible:ring-blue-500"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label={showPass ? 'Hide password' : 'Show password'}
                                        >
                                            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button
                            type="submit"
                            className="w-full h-11 font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
                        </Button>
                    </form>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400">
                            New to UNIQUE?
                        </span>
                    </div>
                </div>

                <Link href="/register">
                    <Button variant="outline" className="w-full h-11 font-semibold text-sm">
                        Create your free account
                    </Button>
                </Link>
            </div>
        </motion.div>
    )
}
