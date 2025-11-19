import { useState } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import TransactionInputForm from "./TransactionInputForm";
import TransactionList from "./TransactionList";
// import BackupPanel from "./BackupPanel";

// 요약 타입
type SummaryStats = {
  incomeSum: number;
  expenseSum: number;
  remain: number;
};

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function AccountBookScreen() {
  const { ready } = useLedgerStoreContext();

  // 거래 내역 필터 결과 기준 요약 상태
  const [summary, setSummary] = useState<SummaryStats>({
    incomeSum: 0,
    expenseSum: 0,
    remain: 0,
  });

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-4 md:flex-row">
        <div className="flex-1 flex flex-col gap-4">
          {/* 필터 결과 요약 카드 */}
          <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">요약</h2>
            <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <div className="flex justify-between">
                <span>수입 합계</span>
                <span className="font-medium" style={{ color: "#4fc785ff" }}>
                  {formatKRW(summary.incomeSum)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>지출 합계</span>
                <span className="font-medium" style={{ color: "#f15b6fff" }}>
                  -{formatKRW(summary.expenseSum)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-500 pt-2 mt-2">
                <span>남은 금액</span>
                <span className="font-bold" style={{ color: "#168effff" }}>
                  {formatKRW(summary.remain)}
                </span>
              </div>
            </div>
          </div>

          <TransactionInputForm />
          {/* <BackupPanel /> */}
        </div>

        <div className="flex-[2]">
          <TransactionList
            onSummaryChange={(stats) => setSummary(stats)}
          />
        </div>
      </div>
    </div>
  );
}
