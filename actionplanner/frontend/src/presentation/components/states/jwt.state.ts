import { makeJwtAdapterFactory } from '@/main/factories'
import { create } from 'zustand'

export const useJwtAdapterState = create(() => ({
  jwtAdapter: makeJwtAdapterFactory()
}))
