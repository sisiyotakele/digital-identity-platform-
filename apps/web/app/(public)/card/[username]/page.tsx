import { redirect } from 'next/navigation'

interface Props {
    params: { username: string }
}

export default function PublicCardRedirect({ params }: Props) {
    redirect(`/${params.username}`)
}
