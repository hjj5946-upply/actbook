import React from "react";
import { useNavigate } from "react-router-dom";

export default function LockScreen() {
  const navigate = useNavigate();

  // 지금은 그냥 버튼 누르면 /app 으로 이동시키는 더미 동작만 한다.
  // (비밀번호 검증은 다음 단계에서 usePasswordGate로 연결한다.)
  function handleUnlock() {
    navigate("/app");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="w-full max-w-sm bg-white text-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">
          잠금 화면 (임시)
        </h1>

        <p className="text-sm text-gray-600 mb-4 text-center">
          여기서 나중에 비밀번호 입력/설정을 넣을 거다.
        </p>

        <button
          onClick={handleUnlock}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          잠금 해제했다고 치고 /app 으로 이동
        </button>
      </div>
    </div>
  );
}