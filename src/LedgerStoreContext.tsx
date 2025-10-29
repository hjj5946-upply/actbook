import React, { createContext, useContext } from "react";
import { useLedgerStore } from "./hooks/useLedgerStore";

const LedgerCtx = createContext<ReturnType<typeof useLedgerStore> | null>(null);

// Provider: 앱 전체를 감싼다. 내부에서 useLedgerStore()를 실제로 호출한다.
export function LedgerStoreProvider({ children }: { children: React.ReactNode }) {
  const store = useLedgerStore();
  return <LedgerCtx.Provider value={store}>{children}</LedgerCtx.Provider>;
}

// Consumer 훅: 아래 훅으로 어디서든 ledger 데이터를 꺼내 쓴다.
export function useLedgerStoreContext() {
  const ctx = useContext(LedgerCtx);
  if (!ctx) {
    throw new Error("useLedgerStoreContext must be used within LedgerStoreProvider");
  }
  return ctx;
}