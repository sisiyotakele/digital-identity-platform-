import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="text-center space-y-4 max-w-sm">
                <p className="text-6xl font-black text-muted-foreground/20">404</p>
                <h1 className="text-xl font-semibold">Page not found</h1>
                <p className="text-sm text-muted-foreground">
                    This page does not exist.
                </p>
                <Link href="/">
                    <Button className="mt-2">Go home</Button>
                </Link>
            </div>
        </div>
    )
}
