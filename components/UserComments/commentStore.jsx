import React, { createContext, useContext } from "react";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

const CommentStoreContext = createContext(null);

export const creatCommentStore = (initValues) => createStore(() => ({ ...initValues }));

export function CommentProvider({ store, children }) {
  return (
    <CommentStoreContext.Provider value={store}>
      {children}
    </CommentStoreContext.Provider>
  );
}

export const useCommentStore = (selector) => {
  const store = useContext(CommentStoreContext);
  return useStore(store, selector);
};
