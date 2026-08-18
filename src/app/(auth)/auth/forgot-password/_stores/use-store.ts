import { create } from "zustand";

type Store = {
  loadingText: string;
  setLoadingText: (text: string) => void;
};

export const useStore = create<Store>((set) => ({
  loadingText: "",
  setLoadingText: (text: string) => set(() => ({ loadingText: text })),
}));
