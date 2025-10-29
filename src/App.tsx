// import React from "react";
import { PasswordGateProvider, usePasswordGateContext } from "./PasswordGateContext";
import { LedgerStoreProvider, /* useLedgerStoreContext */ } from "./LedgerStoreContext";

import LockScreen from "./components/LockScreen";
import AccountBookScreen from "./components/AccountBookScreen";

function RootContent() {
  const { ready, hasPassword, isUnlocked, setupPassword, unlock } = usePasswordGateContext();
  // const ledgerStore = useLedgerStoreContext(); // 사용은 아직 안 하더라도 여기서 호출 가능
  // ledgerStore.ready 등을 여기서 확인할 수 있게 될 것

  // 비번 관련 준비 안 끝났으면 로딩
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩중...
      </div>
    );
  }

  // 잠금 안 풀렸으면 잠금 화면
  if (!isUnlocked) {
    return (
      <LockScreen
        hasPassword={hasPassword}
        onSetup={setupPassword}
        onUnlock={unlock}
      />
    );
  }

  // 잠금 풀렸으면 가계부 화면
  // (3단계에서 실제 데이터 표시하도록 AccountBookScreen을 고도화할 거다)
  return <AccountBookScreen />;
}

export default function App() {
  return (
    <PasswordGateProvider>
      <LedgerStoreProvider>
        <RootContent />
      </LedgerStoreProvider>
    </PasswordGateProvider>
  );
}