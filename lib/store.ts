import { create } from "zustand";

interface GlobalState {
  userId: string | null;
  setUserId: (id: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
