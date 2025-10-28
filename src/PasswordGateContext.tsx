import React, { createContext, useContext } from "react";
import { usePasswordGate as usePasswordGateHook } from "./hooks/usePasswordGate";

const GateCtx = createContext<ReturnType<typeof usePasswordGateHook> | null>(null);

export function PasswordGateProvider({ children }: { children: React.ReactNode }) {
  const gate = usePasswordGateHook();
  return <GateCtx.Provider value={gate}>{children}</GateCtx.Provider>;
}

export function usePasswordGateContext() {
  const ctx = useContext(GateCtx);
  if (!ctx) {
    throw new Error("usePasswordGateContext must be used within PasswordGateProvider");
  }
  return ctx;
}