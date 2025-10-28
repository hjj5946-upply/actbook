import { useState, useEffect } from "react";

const PASSWORD_KEY = "ledger_password_hash";

async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function usePasswordGate() {
  const [ready, setReady] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PASSWORD_KEY);
    setHasPassword(!!stored);
    setReady(true);
  }, []);

  // 비밀번호 규칙: 정확히 숫자 8자리
  function validateFormat(pw: string) {
    // 정규식: ^[0-9]{8}$
    return /^[0-9]{8}$/.test(pw);
  }

  async function setupPassword(
    pw: string,
    confirmPw: string
  ): Promise<{ ok: boolean; message?: string }> {
    if (!validateFormat(pw)) {
      return { ok: false, message: "비밀번호는 숫자 8자리여야 합니다." };
    }
    if (pw !== confirmPw) {
      return { ok: false, message: "비밀번호가 일치하지 않습니다." };
    }

    const hash = await sha256Hex(pw);
    localStorage.setItem(PASSWORD_KEY, hash);

    setHasPassword(true);
    setIsUnlocked(true);

    return { ok: true };
  }

  async function unlock(pw: string): Promise<{ ok: boolean; message?: string }> {
    const stored = localStorage.getItem(PASSWORD_KEY);
    if (!stored) {
      return { ok: false, message: "등록된 비밀번호가 없습니다." };
    }

    if (!validateFormat(pw)) {
      return { ok: false, message: "비밀번호는 숫자 8자리입니다." };
    }

    const hash = await sha256Hex(pw);
    if (hash === stored) {
      setIsUnlocked(true);
      return { ok: true };
    } else {
      return { ok: false, message: "비밀번호가 올바르지 않습니다." };
    }
  }

  function lock() {
    setIsUnlocked(false);
  }

  function resetPassword() {
    localStorage.removeItem(PASSWORD_KEY);
    setHasPassword(false);
    setIsUnlocked(false);
  }

  return {
    ready,
    hasPassword,
    isUnlocked,
    setupPassword,
    unlock,
    lock,
    resetPassword,
  };
}