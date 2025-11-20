import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { PasswordGateProvider, usePasswordGateContext } from "./PasswordGateContext";
import { LedgerStoreProvider } from "./LedgerStoreContext";
import { MemoStoreProvider } from "./MemoStoreContext";

import LockScreen from "./components/LockScreen";
import AccountBookScreen from "./components/AccountBookScreen";
import AppLayout from "./components/AppLayout";
import MemoListScreen from "./components/MemoListScreen";
import MemoDetailScreen from "./components/MemoDetailScreen";
import StatsScreen from "./components/StatsScreen";
import AboutScreen from "./components/AboutScreen";
import PrivacyPolicyScreen from "./components/PrivacyPolicyScreen";
import FaqScreen from "./components/FaqScreen";

function LockRoute() {
  const { ready, isLoggedIn, register, login } = usePasswordGateContext();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩중...
      </div>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/app" replace />;
  }

  return (
    <LockScreen
      onRegister={register}
      onLogin={login}
    />
  );
}

function AppRoute() {
  const { ready, isLoggedIn } = usePasswordGateContext();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩중...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/lock" replace />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <PasswordGateProvider>
      <LedgerStoreProvider>
        <MemoStoreProvider>
          <BrowserRouter basename="/actbook">
            <Routes>
              <Route path="/lock" element={<LockRoute />} />
              
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/privacy" element={<PrivacyPolicyScreen />} />
              <Route path="/faq" element={<FaqScreen />} />

              <Route path="/app" element={<AppRoute />}>
                <Route index element={<Navigate to="/app/ledger" replace />} />
                <Route path="ledger" element={<AccountBookScreen />} />
                <Route path="memo" element={<MemoListScreen />} />
                <Route path="memo/:id" element={<MemoDetailScreen />} />
                <Route path="stats" element={<StatsScreen />} />
              </Route>
              <Route path="*" element={<Navigate to="/lock" replace />} />
            </Routes>
          </BrowserRouter>
        </MemoStoreProvider>
      </LedgerStoreProvider>
    </PasswordGateProvider>
  );
}
