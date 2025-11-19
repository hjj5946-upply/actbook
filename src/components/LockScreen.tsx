import React, { useState } from "react";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

type Result = { ok: boolean; message?: string };

type LockScreenProps = {
  onRegister: (
    nickname: string,
    pw: string,
    confirmPw: string
  ) => Promise<Result>;
  onLogin: (nickname: string, pw: string) => Promise<Result>;
};

export default function LockScreen({
  onRegister,
  onLogin,
}: LockScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!nickname.trim()) {
      setLoading(false);
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (mode === "register") {
      const result = await onRegister(nickname, pw, pw2);
      setLoading(false);
      if (!result.ok) {
        setError(result.message ?? "오류");
        setPw("");
        setPw2("");
      }
    } else {
      const result = await onLogin(nickname, pw);
      setLoading(false);
      if (!result.ok) {
        setError(result.message ?? "오류");
        setPw("");
      }
    }
  }

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError(null);
    setPw("");
    setPw2("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-gray-100 text-gray-900
                    dark:bg-[#1a1a1a] dark:text-gray-100">
      <div className="w-full max-w-sm
                      bg-white text-gray-900
                      dark:bg-[#2b2b2b]/95 dark:text-gray-100
                      rounded-xl
                      shadow-[0_0_12px_rgba(0,0,0,0.18)]
                      dark:shadow-[0_0_3px_rgba(255,255,255,0.35)]
                      p-6 backdrop-blur-md transition-shadow">
        {/* 아이콘 */}
        <h1 className="flex items-center justify-center mb-3">
          {mode === "login" ? (
            <LockKeyholeOpen className="w-9 h-9 text-[#ed374f]" />
          ) : (
            <LockKeyhole className="w-9 h-9 text-[#ed374f]" />
          )}
        </h1>

        {/* 제목 / 설명 */}
        <div className="text-center mb-4">
          <div className="text-base font-semibold mb-1">
            {mode === "login" ? "가계부 잠금 해제" : "가계부 계정 만들기"}
          </div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            닉네임과 숫자 8자리 비밀번호로 접속합니다.
          </div>
        </div>

        {/* 탭: 로그인 / 회원가입 */}
        <div className="flex mb-4 text-sm border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className={`flex-1 py-2 text-center transition-colors ${
              mode === "login"
                ? "text-[#ed374f] border-b-2 border-[#ed374f]"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => switchMode("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center transition-colors ${
              mode === "register"
                ? "text-[#ed374f] border-b-2 border-[#ed374f]"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => switchMode("register")}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              닉네임
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none
                         border-gray-300 bg-white text-gray-900
                         focus:ring-2 focus:ring-[#ed374f] focus:border-[#ed374f]
                         dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-gray-100"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 준"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              비밀번호 (숫자 8자리)
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none
                         border-gray-300 bg-white text-gray-900
                         focus:ring-2 focus:ring-[#ed374f] focus:border-[#ed374f]
                         dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-gray-100"
              value={pw}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9]/g, "");
                setPw(next);
              }}
              placeholder="********"
            />
          </div>

          {/* 비밀번호 확인 (회원가입 모드에서만) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none
                           border-gray-300 bg-white text-gray-900
                           focus:ring-2 focus:ring-[#ed374f] focus:border-[#ed374f]
                           dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-gray-100"
                value={pw2}
                onChange={(e) => {
                  const next = e.target.value.replace(/[^0-9]/g, "");
                  setPw2(next);
                }}
                placeholder="다시 입력"
              />
            </div>
          )}

          {/* 에러 */}
          {error && (
            <div className="text-sm text-[#ed374f]">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ed374f] hover:bg-[#d21731] active:bg-[#b9122a]
                       text-white text-sm font-medium rounded-lg py-2
                       transition-colors disabled:opacity-50
                       shadow-[0_0_10px_rgba(237,26,54,0.3)]
                       hover:shadow-[0_0_20px_rgba(237,26,54,0.4)]"
          >
            {loading
              ? mode === "login"
                ? "로그인 중..."
                : "가입 중..."
              : mode === "login"
              ? "로그인"
              : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
