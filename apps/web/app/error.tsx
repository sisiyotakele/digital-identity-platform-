'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        // Silent — no console.log in production
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-sm">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">
                    An unexpected error occurred. Please try again.
                </p>
                <Button onClick={reset}>Try again</Button>
            </div>
        </div>
    )
}
