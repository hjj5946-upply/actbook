import { useState, useEffect } from "react";
import { registerUser, loginUser } from "./authApi";
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

  return {
    ready,
    currentUser,
    isLoggedIn,
    register,
    login,
    logout,
  };
}
