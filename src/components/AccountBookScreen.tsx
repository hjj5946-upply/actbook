import { useMemo } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import TransactionInputForm from "./TransactionInputForm";
import TransactionList from "./TransactionList";
import BackupPanel from "./BackupPanel";

function getMonthlyStats(items: ReturnType<typeof useLedgerStoreContext>["items"]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const ymPrefix = `${y}-${String(m).padStart(2, "0")}`;

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
  const stats = useMemo(() => getMonthlyStats(items), [items]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        가계부 불러오는 중...
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-4 md:flex-row">
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-[#2b2b2b]/95 text-gray-100 rounded-xl shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow">
            <h2 className="text-lg font-semibold mb-2">이번 달 요약</h2>
            <div className="text-sm text-gray-200 space-y-1">
              <div className="flex justify-between">
                <span>수입 합계</span>
                <span className="font-medium" style={{ color: "#4fc785ff" }}>
                  {formatKRW(stats.incomeSum)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>지출 합계</span>
                <span className="font-medium" style={{ color: "#f15b6fff" }}>
                  -{formatKRW(stats.expenseSum)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-500 pt-2 mt-2">
                <span>남은 금액</span>
                <span className="font-bold" style={{ color: "#168effff" }}>
                  {formatKRW(stats.remain)}
                </span>
              </div>
            </div>
          </div>

          <TransactionInputForm />
          <BackupPanel />
        </div>

        <div className="flex-[2]">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}