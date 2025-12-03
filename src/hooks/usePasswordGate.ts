import { useState, useEffect } from "react";
import { registerUser, loginUser, deleteUser } from "./authApi";
import { deleteAllLedgerRows } from "./ledgerApi";
import type { AppUser } from "./authApi";

const CURRENT_USER_KEY = "accountbook.currentUser";

export type CurrentUser = {
  id: string;
  nickname: string;
};

type Result = { ok: boolean; message?: string };

function loadCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string" && typeof parsed.nickname === "string") {
      return { id: parsed.id, nickname: parsed.nickname };
    }
    return null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user: CurrentUser | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function usePasswordGate() {
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const loaded = loadCurrentUser();
    setCurrentUser(loaded);
    setReady(true);
  }, []);

  const isLoggedIn = !!currentUser;

  // 회원가입: 닉네임 + 비밀번호 + 비밀번호 확인
  async function register(
    nickname: string,
    pw: string,
    confirmPw: string
  ): Promise<Result> {
    if (pw !== confirmPw) {
      return { ok: false, message: "비밀번호가 일치하지 않습니다." };
    }

    const res = await registerUser(nickname, pw);
    if (!res.ok) {
      return { ok: false, message: res.message };
    }

    const user = res.user as AppUser;
    const simple: CurrentUser = { id: user.id, nickname: user.nickname };
    setCurrentUser(simple);
    saveCurrentUser(simple);

    return { ok: true };
  }

  // 로그인: 닉네임 + 비밀번호
  async function login(nickname: string, pw: string): Promise<Result> {
    const res = await loginUser(nickname, pw);
    if (!res.ok) {
      return { ok: false, message: res.message };
    }

    const user = res.user as AppUser;
    const simple: CurrentUser = { id: user.id, nickname: user.nickname };
    setCurrentUser(simple);
    saveCurrentUser(simple);

    return { ok: true };
  }

  function logout() {
    setCurrentUser(null);
    saveCurrentUser(null);
  }

  // 회원탈퇴: 모든 데이터 삭제 후 로그아웃
  async function deleteAccount(): Promise<Result> {
    if (!currentUser) {
      return { ok: false, message: "로그인된 사용자가 없습니다." };
    }

    try {
      // 1. 모든 거래 내역 삭제
      await deleteAllLedgerRows(currentUser.id);

      // 2. 사용자 계정 삭제
      const res = await deleteUser(currentUser.id);
      if (!res.ok) {
        return { ok: false, message: res.message };
      }

      // 3. 로컬 스토리지 정리 및 로그아웃
      logout();

      return { ok: true };
    } catch (e) {
      console.error("deleteAccount error", e);
      return { ok: false, message: "회원탈퇴 중 오류가 발생했습니다." };
    }
  }

  return {
    ready,
    currentUser,
    isLoggedIn,
    register,
    login,
    logout,
    deleteAccount,
  };
}
