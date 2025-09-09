import { makeLocalStorageAdapter } from "@/main/factories";
import { create } from "zustand";

export const useLocalStorageAdapterState = create(() => ({
  localStorageAdapter: makeLocalStorageAdapter()
}))
