import { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface UserState {
    user: User | null
    setUser: (user: User | null) => void
}

export const userState = create<UserState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
}))
