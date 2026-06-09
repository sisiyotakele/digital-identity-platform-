'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormValues } from '@/lib/validations'

const perks = ['Free forever on basic plan', 'No credit card needed', 'Set up in 2 minutes']

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
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
            toast.error(error.message.includes('already registered') ? 'An account with this email already exists' : error.message)
            return
        }

        toast.success('Account created — check your email to verify')
        router.push('/verify-email')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
        >
            <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create your card</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Join 50,000+ professionals on UNIQUE</p>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
                {perks.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        {p}
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-7 shadow-sm space-y-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Abel Abebe" autoComplete="name"
                                        className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Work email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="abel@company.com.et" autoComplete="email"
                                        className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                                            autoComplete="new-password"
                                            className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 pr-10" {...field} />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Repeat your password" autoComplete="new-password"
                                        className="h-11 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" disabled={loading}
                            className="w-full h-11 font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 border-0 text-white hover:opacity-90 shadow-sm">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Create free account'}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-xs text-gray-400">
                    By signing up you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-gray-600">Terms</Link> and{' '}
                    <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
                </p>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
                </div>
            </div>
        </motion.div>
    )
}
