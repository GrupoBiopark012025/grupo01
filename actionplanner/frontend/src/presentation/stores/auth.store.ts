import { create } from "zustand";
import type { AuthenticationUserModel } from "@/domain/models/auth";

type AuthStore = {
  user: AuthenticationUserModel | null
  setUser: (user: AuthenticationUserModel) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: AuthenticationUserModel | null) => set({ user })
}))
