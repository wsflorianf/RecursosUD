import {create} from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) => set({ user: newUser }),
      changeAdmin: ()=>set((prev)=>({user: {...prev.user, admin: !prev.user.admin}}))
    }),
    { name: 'auth' }
  )
)
