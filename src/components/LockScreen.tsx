import React, { useState } from "react";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

type LockScreenProps = {
  hasPassword: boolean;
  onSetup: (
    pw: string,
    confirmPw: string
  ) => Promise<{ ok: boolean; message?: string }>;
  onUnlock: (
    pw: string
  ) => Promise<{ ok: boolean; message?: string }>;
};

export default function LockScreen({
  hasPassword,
  onSetup,
  onUnlock,
}: LockScreenProps) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!hasPassword) {
      const result = await onSetup(pw, pw2);
      setLoading(false);
      if (!result.ok) {
        setError(result.message ?? "오류");
        setPw("");
        setPw2("");
      }
    } else {
      const result = await onUnlock(pw);
      setLoading(false);
      if (!result.ok) {
        setError(result.message ?? "오류");
        setPw("");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-gray-100 px-4">
      <div className="w-full max-w-sm bg-[#2b2b2b]/95 text-gray-100 rounded-xl shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow">
        {/* 중앙 아이콘 */}
        <h1 className="flex items-center justify-center mb-4">
          {hasPassword ? (
            <LockKeyholeOpen className="w-9 h-9 text-[#ed1a36]" />
          ) : (
            <LockKeyhole className="w-9 h-9 text-[#ed1a36]" />
          )}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {hasPassword ? "8자리 숫자 비밀번호" : "새 비밀번호 (숫자 8자리)"}
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              className="w-full border border-gray-600 bg-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-[#ed1a36] focus:border-[#ed1a36] transition"
              value={pw}
              onChange={(e) => {
                const next = e.target.value.replace(/[^0-9]/g, "");
                setPw(next);
              }}
              placeholder="********"
            />
          </div>

          {/* 비밀번호 확인 */}
          {!hasPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                className="w-full border border-gray-600 bg-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-[#ed1a36] focus:border-[#ed1a36] transition"
                value={pw2}
                onChange={(e) => {
                  const next = e.target.value.replace(/[^0-9]/g, "");
                  setPw2(next);
                }}
                placeholder="다시 입력"
              />
            </div>
          )}

          {/* 에러 메시지 */}
          {error && <div className="text-sm text-[#ed1a36]">{error}</div>}

          {/* 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ed1a36] hover:bg-[#d21731] active:bg-[#b9122a] text-white text-sm font-medium rounded-lg py-2 transition-colors disabled:opacity-50 shadow-[0_0_10px_rgba(237,26,54,0.3)] hover:shadow-[0_0_20px_rgba(237,26,54,0.4)]"
          >
            {loading
              ? hasPassword
                ? "확인 중..."
                : "저장 중..."
              : hasPassword
              ? "해제"
              : "저장"}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-500 mt-6 leading-relaxed">
          데이터 보안용 암호화
        </p>
      </div>
    </div>
  );
}