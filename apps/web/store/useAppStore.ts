import { create } from 'zustand'
import type { Profile, BusinessCard } from '@/lib/types'

interface AppStore {
    profile: Profile | null
    setProfile: (profile: Profile | null) => void
    activeCard: BusinessCard | null
    setActiveCard: (card: BusinessCard | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    activeCard: null,
    setActiveCard: (card) => set({ activeCard: card }),
}))
