export type UserRole = 'user' | 'admin'

export interface Profile {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    role: UserRole
    created_at: string
    updated_at: string
}
