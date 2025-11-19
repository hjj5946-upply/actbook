import React, { useState } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import { CATEGORY_OPTIONS } from "../utils/categories";

// 숫자만 남기고 나머지 제거
function onlyDigits(v: string) {
  return v.replace(/[^0-9]/g, "");
}

// 12자리 제한
function limitLength12(v: string) {
  if (v.length > 12) return v.slice(0, 12);
  return v;
}

// 화면 표시용 포맷 (쉼표 삽입)
function formatWithCommas(v: string) {
  if (!v) return "";
  const num = parseInt(v, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("ko-KR");
}

// 실제 저장용 숫자 변환
function toNumber(v: string): number | null {
  if (!v) return null;
  const n = parseInt(v.replace(/,/g, ""), 10);
  return isNaN(n) ? null : n;
}

export default function TransactionInputForm() {
  const { addItem } = useLedgerStoreContext();

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const [date, setDate] = useState(todayStr);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amountInput, setAmountInput] = useState(""); // 표시용 문자열
  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [memo, setMemo] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = onlyDigits(e.target.value);
    raw = limitLength12(raw);
    const display = formatWithCommas(raw);
    setAmountInput(display);
  }

  function handleMemoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v.length <= 30) {
      setMemo(v);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = toNumber(amountInput);
    if (parsed === null || parsed <= 0) {
      setError("금액을 입력하세요. (1원 이상, 최대 12자리)");
      return;
    }

    if (!date) {
      setError("날짜를 선택하세요.");
      return;
    }

    if (!category) {
      setError("카테고리를 선택하세요.");
      return;
    }

    addItem({
      date,
      type,
      category: category.trim(),
      memo: memo.trim(),
      amount: parsed,
    });

    setAmountInput("");
    setMemo("");
  }

  return (
    <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow">
      <h2 className="text-lg font-semibold mb-3">새 거래 입력</h2>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        {/* 날짜 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            날짜
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                       dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 구분 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            구분
          </label>
          <select
            className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                       dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
            value={type}
            onChange={(e) =>
              setType(e.target.value === "income" ? "income" : "expense")
            }
          >
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </select>
        </div>

        {/* 금액 (콤마 표시, 숫자만 허용, 12자리 제한) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            금액 (원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-right text-sm font-semibold outline-none
                       focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                       dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
            value={amountInput}
            onChange={handleAmountChange}
            placeholder="예: 100,000"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            카테고리
          </label>
          <select
            className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                       dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* 메모 (30자 제한, 비워도 됨) */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
            메모 (선택)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                       dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
            value={memo}
            onChange={handleMemoChange}
            placeholder="예: OOO 구매"
          />
          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-right">
            {memo.length}/30
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-[#ed374f] hover:bg-[#d21731] text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          추가
        </button>
      </form>
    </div>
  );
}
