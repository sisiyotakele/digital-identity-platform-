import { cn } from '@/lib/utils'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    variant?: 'default' | 'white' | 'dark'
    showText?: boolean
    className?: string
}

export function Logo({ size = 'md', variant = 'default', showText = true, className }: LogoProps) {
    const sizes = { sm: 28, md: 36, lg: 48 }
    const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }
    const s = sizes[size]

    return (
        <div className={cn('flex items-center gap-2.5 select-none', className)}>
            <svg
                width={s}
                height={s}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
                {/* Card shape */}
                <rect x="4" y="10" width="32" height="22" rx="4" fill="url(#logoGrad)" />
                {/* Chip detail */}
                <rect x="9" y="16" width="8" height="6" rx="1.5" fill="white" fillOpacity="0.4" />
                {/* Lines */}
                <rect x="9" y="26" width="14" height="2" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="9" y="29" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.4" />
                {/* NFC wave */}
                <path d="M26 17 Q29 20 26 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
                <path d="M28.5 14.5 Q33 20 28.5 25.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
            </svg>

            {showText && (
                <div className="leading-none">
                    <p
                        className={cn(
                            'font-black tracking-wider',
                            textSizes[size],
                            variant === 'white'
                                ? 'text-white'
                                : variant === 'dark'
                                    ? 'text-gray-900'
                                    : 'bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'
                        )}
                    >
                        UNIQUE
                    </p>
                    {size !== 'sm' && (
                        <p className={cn(
                            'text-[9px] uppercase tracking-[0.15em] font-medium mt-0.5',
                            variant === 'white' ? 'text-white/60' : 'text-muted-foreground'
                        )}>
                            Digital Card
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
