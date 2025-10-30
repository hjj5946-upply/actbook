import React, { useState, useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import type { LedgerItem } from "../hooks/useLedgerStore";
import { CATEGORY_OPTIONS } from "../utils/categories";

function onlyDigits(v: string) {
  return v.replace(/[^0-9]/g, "");
}
function limitLength12(v: string) {
  if (v.length > 12) return v.slice(0, 12);
  return v;
}
function formatWithCommas(v: string) {
  if (!v) return "";
  const num = parseInt(v, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("ko-KR");
}
function toNumber(v: string): number | null {
  if (!v) return null;
  const n = parseInt(v.replace(/,/g, ""), 10);
  return isNaN(n) ? null : n;
}

function formatDate(dateStr: string) {
  return dateStr;
}

export default function TransactionList() {
  const { ready, items, removeItem, updateItem } = useLedgerStoreContext();

  // 필터 초기값: 이번 달 1일 ~ 오늘
  const getInitialDateRange = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
    const todayStr = today.toISOString().slice(0, 10);
    return { start: startOfMonth, end: todayStr };
  };

  const initialRange = getInitialDateRange();

  // 필터 상태
  const [filterMode, setFilterMode] = useState<"range" | "month">("range");
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);
  const [monthFilter, setMonthFilter] = useState(initialRange.start.slice(0, 7)); // "YYYY-MM"
  const [categoryFilter, setCategoryFilter] = useState<string>("전체");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");

  // 수정 모드 상태
  const [editId, setEditId] = useState<string | null>(null);
  const [editAmountInput, setEditAmountInput] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  // 필터링된 항목
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 날짜 필터
      if (filterMode === "range") {
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
      } else {
        // month 모드
        if (monthFilter && !item.date.startsWith(monthFilter)) return false;
      }

      // 카테고리 필터
      if (categoryFilter !== "전체" && item.category !== categoryFilter) {
        return false;
      }

      // 구분 필터
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [items, filterMode, startDate, endDate, monthFilter, categoryFilter, typeFilter]);

  // 필터 초기화
  function resetFilters() {
    const initial = getInitialDateRange();
    setFilterMode("range");
    setStartDate(initial.start);
    setEndDate(initial.end);
    setMonthFilter(initial.start.slice(0, 7));
    setCategoryFilter("전체");
    setTypeFilter("all");
  }

  if (!ready) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-gray-200 text-sm">
        가계부 불러오는 중...
      </div>
    );
  }

  function startEdit(item: LedgerItem) {
    setEditId(item.id);
    const displayAmt = item.amount.toLocaleString("ko-KR");
    setEditAmountInput(displayAmt);
    setEditCategory(item.category);
    setEditMemo(item.memo);
    setEditError(null);
  }

  function cancelEdit() {
    setEditId(null);
    setEditAmountInput("");
    setEditCategory("");
    setEditMemo("");
    setEditError(null);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = onlyDigits(e.target.value);
    raw = limitLength12(raw);
    const display = formatWithCommas(raw);
    setEditAmountInput(display);
  }

  function handleMemoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v.length <= 30) {
      setEditMemo(v);
    }
  }

  function saveEdit(id: string) {
    const parsedAmt = toNumber(editAmountInput);
    if (parsedAmt === null || parsedAmt <= 0) {
      setEditError("금액을 올바르게 입력하세요. (1원 이상, 최대 12자리)");
      return;
    }

    if (!editCategory) {
      setEditError("카테고리를 선택하세요.");
      return;
    }

    updateItem(id, {
      amount: parsedAmt,
      category: editCategory.trim(),
      memo: editMemo.trim(),
    });

    cancelEdit();
  }

  return (
    <div className="bg-[#2b2b2b]/95 text-gray-100 rounded-xl shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow shadow flex flex-col h-full">
      {/* 헤더 영역 */}
      <div className="border-b border-gray-400 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-3">거래 내역</h2>
      </div>

      {/* 필터 영역 */}
      <div className="border-b border-gray-400 flex-shrink-0 space-y-3 mt-7 pb-1">
        {/* 날짜 필터 모드 선택 */}
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-xs font-medium text-gray-300">날짜:</span>
            <button
              className={`text-xs px-3.5 py-2 rounded-lg transition-colors ${
                filterMode === "range"
                  ? "bg-[#ed374f] text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setFilterMode("range")}
            >
              기간
            </button>
            <button
              className={`text-xs px-5 py-2 rounded-lg transition-colors ${
                filterMode === "month"
                  ? "bg-[#ed374f] text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setFilterMode("month")}
            >
              월
            </button>
          </div>
          <button
            onClick={resetFilters}
            className="text-gray-300 hover:text-[#ed374f] transition-colors"
            aria-label="필터 초기화"
          >
            <RefreshCcw className="w-7 h-7" />
          </button>
        </div>

        {/* 날짜 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filterMode === "range" ? (
            <>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">시작일</label>
                <input
                  type="date"
                  className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2.5 text-xs text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">종료일</label>
                <input
                  type="date"
                  className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2.5 text-xs text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">월 선택</label>
              <input
                type="month"
                className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2.5 text-xs text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* 카테고리 & 구분 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-5">
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">카테고리</label>
            <select
              className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2.5 text-xs text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-gray-400 mb-1">구분</label>
            <select
              className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2.5 text-xs text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | "income" | "expense")}
            >
              <option value="all">전체</option>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
        </div>

        {/* 필터 결과 요약 */}
        <div className="text-[11px] text-gray-400">
          총 {filteredItems.length}개 항목
        </div>
      </div>

      {/* 리스트 영역 (이 부분만 스크롤) */}
      <div className="flex-1 overflow-y-auto max-h-[580px] md:max-h-[700px] lg:max-h-[780px]">
        {filteredItems.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            조건에 맞는 거래 내역이 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-gray-400">
            {filteredItems.map((item: LedgerItem) => {
              const isEditing = editId === item.id;

              return (
                <li
                  key={item.id}
                  className="py-3 flex flex-col md:flex-row md:items-start md:justify-between gap-3"
                >
                  {/* 왼쪽 영역 */}
                  <div className="text-sm flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={
                          "text-xs font-semibold rounded px-2.5 py-1 " +
                          (item.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700")
                        }
                      >
                        {item.type === "income" ? "수입" : "지출"}
                      </span>
                      <span className="text-gray-200 text-s">
                        {formatDate(item.date)}
                      </span>

                      {!isEditing ? (
                        <span className="text-gray-300 text-s ml-2 font-semibold">
                          {item.category || "분류없음"}
                        </span>
                      ) : (
                        <select
                          className="border rounded border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2 text-[11px] text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                    </div>


                    {!isEditing ? (
                      <div className="mt-2 text-gray-200 text-sm break-words">
                        {item.memo || "-"}
                      </div>
                    ) : (
                      <input
                        className="mt-3 w-full border rounded border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent"
                        value={editMemo}
                        onChange={handleMemoChange}
                        placeholder="메모 (최대 30자)"
                      />
                    )}
                  </div>

                  {/* 오른쪽 영역: 금액 + 액션 */}
                  <div className="flex flex-col items-end gap-2 min-w-[140px]">
                    {!isEditing ? (
                      <div
                        className="text-base font-semibold text-right"
                        style={{
                          color: item.type === "income" ? "#4fc785" : "#f54058ff"
                        }}
                      >

                        {item.type === "income"
                          ? "+" + item.amount.toLocaleString("ko-KR") + "원"
                          : "-" + item.amount.toLocaleString("ko-KR") + "원"}
                      </div>
                    ) : (
                      <input
                        className={
                          "w-full border rounded border-gray-700 bg-[#1e1e1e] rounded-lg px-3 py-2 text-right text-sm font-semibold text-gray-100 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent" +
                          (item.type === "income"
                            ? ""
                            : "")
                        }
                        value={editAmountInput}
                        onChange={handleAmountChange}
                        inputMode="numeric"
                        placeholder="금액"
                      />
                    )}

                    {!isEditing ? (
                      <div className="flex gap-2">
                        <button
                          className="text-xs text-gray-200 hover:text-gray-300 border border-gray-200 hover:border-gray-300 rounded px-3 py-2"
                          onClick={() => startEdit(item)}
                        >
                          수정
                        </button>

                        <button
                          className="text-xs text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded px-3 py-2"
                          onClick={() => removeItem(item.id)}
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1 w-full">
                        {editError && (
                          <div className="text-[11px] text-red-600 text-right w-full">
                            {editError}
                          </div>
                        )}

                        <div className="flex gap-2 flex-wrap justify-end w-full">
                          <button
                            className="text-xs text-white bg-[#ed374f] hover:bg-[#d21731]  rounded px-3 py-2"
                            onClick={() => saveEdit(item.id)}
                          >
                            저장
                          </button>
                          <button
                            className="text-xs text-gray-200 hover:text-gray-300 border border-gray-200 hover:border-gray-300 rounded px-3 py-2"
                            onClick={cancelEdit}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}