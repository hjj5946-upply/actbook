import React, { useState } from "react";

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

export default function LockScreen({ hasPassword, onSetup, onUnlock }: LockScreenProps) {
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
        // 실패 시 보안상 비번 비우고 다시 쓰게 할지 선택
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="w-full max-w-sm bg-white text-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          {hasPassword ? "비밀번호 입력" : "비밀번호 최초 설정"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {hasPassword ? "8자리 숫자 비밀번호" : "새 비밀번호 (숫자 8자리)"}
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={pw}
              onChange={(e) => {
                // 숫자만 허용
                const next = e.target.value.replace(/[^0-9]/g, "");
                setPw(next);
              }}
              placeholder="********"
            />
          </div>

          {/* 확인 입력: 최초 설정시에만 노출 */}
          {!hasPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={pw2}
                onChange={(e) => {
                  const next = e.target.value.replace(/[^0-9]/g, "");
                  setPw2(next);
                }}
                placeholder="다시 입력"
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors disabled:opacity-50"
          >
            {loading
              ? (hasPassword ? "확인 중..." : "저장 중...")
              : (hasPassword ? "해제" : "저장")}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-6 leading-relaxed">
          데이터 보안용 암호화
        </p>
      </div>
    </div>
  );
}