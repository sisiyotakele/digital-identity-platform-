'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
            scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-border' : 'bg-transparent'
        )}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="size-4 text-primary-foreground" />
                    </div>
                    {siteConfig.name}
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                    <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
                    <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Templates</a>
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Sign in</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Get started free</Button>
                    </Link>
                </div>

                <button
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
                    <a href="#features" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>Features</a>
                    <a href="#how-it-works" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>How it works</a>
                    <a href="#templates" className="block text-sm py-2" onClick={() => setMobileOpen(false)}>Templates</a>
                    <div className="flex gap-3 pt-2">
                        <Link href="/login" className="flex-1">
                            <Button variant="outline" className="w-full" size="sm">Sign in</Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                            <Button className="w-full" size="sm">Get started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
