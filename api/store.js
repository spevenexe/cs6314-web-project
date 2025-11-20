/**
 * This file contains zustand stores for sharing data
 */
import { create } from "zustand";
import { PageType } from "./lib";

export const usePageStore = create((set) => ({
  userId: "",
  pageType: PageType.DETAIL,
  UpdatePageStore: (userId, pageType) => set(() => ({ userId: userId, pageType: pageType })),
  UpdateID: (userId) => set(() => ({ userId: userId })),
  UpdatePageType: (pageType) => set(() => ({ pageType: pageType })),
}));

export const usePhoto = create();