import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LockScreen from "./components/LockScreen";
import AccountBookScreen from "./components/AccountBookScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 잠금/로그인 페이지 */}
        <Route path="/lock" element={<LockScreen />} />

        {/* 실제 가계부 화면 */}
        <Route path="/app" element={<AccountBookScreen />} />

        {/* 기본 진입은 /lock 으로 */}
        <Route path="*" element={<Navigate to="/lock" replace />} />
      </Routes>
    </BrowserRouter>
  );
}