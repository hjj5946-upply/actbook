import React, { useState } from "react";
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

function formatKRW(amount: number) {
  return amount.toLocaleString("ko-KR") + "원";
}
function formatDate(dateStr: string) {
  return dateStr;
}

export default function TransactionList() {
  const { ready, items, removeItem, updateItem } = useLedgerStoreContext();

  const [editId, setEditId] = useState<string | null>(null);

  const [editAmountInput, setEditAmountInput] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  if (!ready) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-gray-500 text-sm">
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
    <div className="bg-white rounded-xl shadow flex flex-col h-full">
      {/* 헤더 영역 (스크롤 고정) */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-1">거래 내역</h2>
        {items.length === 0 && (
          <p className="text-sm text-gray-500 m-0">아직 기록이 없습니다.</p>
        )}
      </div>

      {/* 리스트 영역 (이 부분만 스크롤) */}
      <div className="flex-1 overflow-y-auto max-h-[600px] md:max-h-[720px] lg:max-h-[800px] p-4">
        {items.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {items.map((item: LedgerItem) => {
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
                          "text-xs font-semibold rounded px-2 py-0.5 " +
                          (item.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700")
                        }
                      >
                        {item.type === "income" ? "수입" : "지출"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatDate(item.date)}
                      </span>

                      {!isEditing ? (
                        <span className="text-gray-400 text-[11px]">
                          {item.category || "분류없음"}
                        </span>
                      ) : (
                        <select
                          className="border rounded px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="mt-1 text-gray-800 text-sm break-words">
                        {item.memo || "-"}
                      </div>
                    ) : (
                      <input
                        className="mt-2 w-full border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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
                        className={
                          "text-base font-semibold text-right " +
                          (item.type === "income"
                            ? "text-green-600"
                            : "text-red-600")
                        }
                      >
                        {item.type === "income"
                          ? "+" + item.amount.toLocaleString("ko-KR") + "원"
                          : "-" + item.amount.toLocaleString("ko-KR") + "원"}
                      </div>
                    ) : (
                      <input
                        className={
                          "w-full border rounded px-2 py-1 text-right text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 " +
                          (item.type === "income"
                            ? "text-green-600"
                            : "text-red-600")
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
                          className="text-xs text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-500 rounded px-2 py-1"
                          onClick={() => startEdit(item)}
                        >
                          수정
                        </button>

                        <button
                          className="text-xs text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded px-2 py-1"
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
                            className="text-xs text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded px-2 py-1"
                            onClick={() => saveEdit(item.id)}
                          >
                            저장
                          </button>
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-500 rounded px-2 py-1"
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