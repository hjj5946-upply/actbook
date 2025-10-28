import React, { useMemo } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import TransactionInputForm from "./TransactionInputForm";
import TransactionList from "./TransactionList";
import BackupPanel from "./BackupPanel";

// 이번 달 합계를 계산하는 헬퍼
function getMonthlyStats(items: ReturnType<typeof useLedgerStoreContext>["items"]) {
  // 현재 연/월
  const now = new Date();
  const y = now.getFullYear(); // 예: 2025
  const m = now.getMonth() + 1; // JS 기준 0~11 이라 +1
  const ymPrefix = `${y}-${String(m).padStart(2, "0")}`; // "2025-10"

  let incomeSum = 0;
  let expenseSum = 0;

  for (const it of items) {
    if (it.date.startsWith(ymPrefix)) {
      if (it.type === "income") {
        incomeSum += it.amount;
      } else {
        expenseSum += it.amount;
      }
    }
  }

  return {
    incomeSum,
    expenseSum,
    remain: incomeSum - expenseSum,
  };
}

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function AccountBookScreen() {
  const { ready, items } = useLedgerStoreContext();

  // 이번 달 통계를 memo로 계산
  const stats = useMemo(() => getMonthlyStats(items), [items]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        가계부 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-4 md:flex-row">

        {/* 좌측: 월 요약 + 입력 폼 */}
        <div className="flex-1 flex flex-col gap-4">
          {/* 월 요약 카드 */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">이번 달 요약</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>수입 합계</span>
                <span className="font-medium text-green-600">
                  {formatKRW(stats.incomeSum)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>지출 합계</span>
                <span className="font-medium text-red-600">
                  -{formatKRW(stats.expenseSum)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>남은 금액</span>
                <span className="font-bold text-blue-600">
                  {formatKRW(stats.remain)}
                </span>
              </div>
            </div>
          </div>

          {/* 새 거래 입력 폼 */}
          <TransactionInputForm />
          
          {/* 백업 / 복원 */}
          <BackupPanel />
        </div>

        {/* 우측: 거래 내역 리스트 */}
        <div className="flex-[2]">
          <TransactionList />
        </div>

      </div>
    </div>
  );
}