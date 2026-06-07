import { CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = { title: 'Billing' }

export default function BillingPage() {
    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Billing</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your plan and payment details</p>
            </div>

            <Card>
                <CardContent className="py-12 text-center">
                    <CreditCard className="size-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">You are on the Free plan</p>
                    <p className="text-sm text-muted-foreground">Paid plans coming soon with more cards, analytics, and features.</p>
                </CardContent>
            </Card>
        </div>
    )
}
