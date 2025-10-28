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
  // 앞에서 숫자만 남겼으므로 parseInt 후 localeString 사용
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

  // 금액은 표시용 문자열 상태로 관리한다 (쉼표 포함)
  const [amountInput, setAmountInput] = useState("");

  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [memo, setMemo] = useState("");

  const [error, setError] = useState<string | null>(null);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 1) 숫자만 추출
    let raw = onlyDigits(e.target.value);
    // 2) 최대 12자리 제한
    raw = limitLength12(raw);
    // 3) 쉼표 표시 버전으로 변환
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

    // 금액 검증
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

    // 저장
    addItem({
      date,
      type,
      category: category.trim(),
      memo: memo.trim(), // memo는 빈 문자여도 허용
      amount: parsed,
    });

    // 입력값 일부 초기화
    setAmountInput("");
    setMemo("");
    // date/type/category는 유지
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">새 거래 입력</h2>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-800">

        {/* 날짜 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            날짜
          </label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 구분 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            구분
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            금액 (원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border rounded-lg px-3 py-2 text-right font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            value={amountInput}
            onChange={handleAmountChange}
            placeholder="예: 100,000"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            카테고리
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            메모 (선택)
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={memo}
            onChange={handleMemoChange}
            placeholder="예: OOO 구매"
          />
          <div className="text-[11px] text-gray-400 mt-1 text-right">
            {memo.length}/30
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-600">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          추가
        </button>
      </form>
    </div>
  );
}