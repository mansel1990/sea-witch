import { create } from "zustand";

interface GlobalState {
  clerkUserId: string | null;
  setClerkUserId: (id: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  clerkUserId: null,
  setClerkUserId: (id) => set({ clerkUserId: id }),
}));
