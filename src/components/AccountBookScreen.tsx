import React from "react";

export default function AccountBookScreen() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-4 md:flex-row">

        {/* 월 요약 카드 */}
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">이번 달 요약 (임시)</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>급여(수입)</span>
              <span className="font-medium text-green-600">2,000,000원</span>
            </div>
            <div className="flex justify-between">
              <span>고정지출</span>
              <span className="font-medium text-red-600">-800,000원</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>현재 남은 금액</span>
              <span className="font-bold text-blue-600">1,200,000원</span>
            </div>
          </div>
        </div>

        {/* 거래내역 / 입력 폼 자리 */}
        <div className="flex-[2] bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            거래 내역 / 입력 영역 (임시)
          </h2>
          <p className="text-sm text-gray-500">
            나중에 여기서 “오늘 점심 8,000원 지출” 같은 걸 입력하고 리스트로 관리하게 된다.
          </p>
        </div>

      </div>
    </div>
  );
}