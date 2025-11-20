/**
 * This file contains zustand stores for sharing data
 */
import { create } from "zustand";
import { PageType } from "./lib";

/**
 * Stores general context for the top bar to render
 */
export const usePageStore = create((set) => ({
  userId: "",
  pageType: PageType.DETAIL,
  UpdatePageStore: (userId, pageType) => set(() => ({ userId: userId, pageType: pageType })),
  UpdateID: (userId) => set(() => ({ userId: userId })),
  UpdatePageType: (pageType) => set(() => ({ pageType: pageType })),
}));

/**
 * Decides whether to include advanced features such as photo scrolling and comment viewing.
 */
export const useAdvancedFeature = create((set) => ({
  advancedEnabled: false,
  ToggleAdvancedFeatures: () => set((state) => ({ advancedEnabled: !state.advancedEnabled })),
  setAdvancedFeatures: (val) => set(() => ({ advancedEnabled: val })),
}));

export const useLogin = create((set) => ({
  token: "", // uid for now
  setToken: (tok) => set(() => ({ token: tok })),
}));