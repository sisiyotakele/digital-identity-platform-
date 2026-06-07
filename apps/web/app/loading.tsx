import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="space-y-3 w-full max-w-sm px-4">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-48 w-full mt-4" />
            </div>
        </div>
    )
}
