import React, { createContext, useContext } from "react";
import { useMemoStore } from "./hooks/useMemoStore";

const MemoCtx = createContext<ReturnType<typeof useMemoStore> | null>(null);

export function MemoStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemoStore();
  return <MemoCtx.Provider value={store}>{children}</MemoCtx.Provider>;
}

export function useMemoStoreContext() {
  const ctx = useContext(MemoCtx);
  if (!ctx) {
    throw new Error("useMemoStoreContext must be used within MemoStoreProvider");
  }
  return ctx;
}