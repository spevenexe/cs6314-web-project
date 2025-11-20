/**
 * This file contains zustand stores for sharing data
 */
import { create } from "zustand";
import { PageType } from "./lib";

export const usePageStore = create((set) => ({
  userId: "",
  name: "",
  pageType: PageType.DETAIL,
  UpdatePageInfo: (userId, name, pageType) => set(() => ({ userId: userId, name: name, pageType: pageType })),
  UpdateID: (userId) => set(() => ({ userId: userId })),
  UpdateName: (name) => set(() => ({ name: name })),
  UpdatePageType: (pageType) => set(() => ({ pageType: pageType })),
}));

export const usePhoto = create();