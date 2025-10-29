import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { PasswordGateProvider, usePasswordGateContext } from "./PasswordGateContext";
import { LedgerStoreProvider } from "./LedgerStoreContext";

import LockScreen from "./components/LockScreen";
import AccountBookScreen from "./components/AccountBookScreen";

// /lock 전용 라우트
function LockRoute() {
  const { ready, hasPassword, setupPassword, unlock, isUnlocked } = usePasswordGateContext();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩중...
      </div>
    );
  }

  // 이미 잠금 풀렸으면 /app 으로 보내버림
  if (isUnlocked) {
    return <Navigate to="/app" replace />;
  }

  return (
    <LockScreen
      hasPassword={hasPassword}
      onSetup={setupPassword}
      onUnlock={unlock}
    />
  );
}

// /app 전용 라우트
function AppRoute() {
  const { ready, isUnlocked } = usePasswordGateContext();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩중...
      </div>
    );
  }

  // 아직 언락 안 됐으면 /lock으로 돌린다.
  if (!isUnlocked) {
    return <Navigate to="/lock" replace />;
  }

  // 언락된 상태면 실제 가계부 화면
  return <AccountBookScreen />;
}

export default function App() {
  return (
    <PasswordGateProvider>
      <LedgerStoreProvider>
        <BrowserRouter basename="/actbook">
          <Routes>
            <Route path="/lock" element={<LockRoute />} />
            <Route path="/app" element={<AppRoute />} />
            <Route path="*" element={<Navigate to="/lock" replace />} />
          </Routes>
        </BrowserRouter>
      </LedgerStoreProvider>
    </PasswordGateProvider>
  );
}