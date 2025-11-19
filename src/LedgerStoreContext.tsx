// LedgerStoreContext.tsx
import React, { createContext, useContext } from "react";
import { useLedgerStore } from "./hooks/useLedgerStore";
import { usePasswordGateContext } from "./PasswordGateContext";

const LedgerCtx = createContext<ReturnType<typeof useLedgerStore> | null>(null);

export function LedgerStoreProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = usePasswordGateContext();
  const userId = currentUser?.id ?? null;

  const store = useLedgerStore(userId);

  return <LedgerCtx.Provider value={store}>{children}</LedgerCtx.Provider>;
}

export function useLedgerStoreContext() {
  const ctx = useContext(LedgerCtx);
  if (!ctx) {
    throw new Error("useLedgerStoreContext must be used within LedgerStoreProvider");
  }
  return ctx;
}
