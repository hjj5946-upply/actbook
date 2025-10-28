import { useState, useEffect } from "react";

const STORAGE_KEY = "ledger_items";

export type LedgerItem = {
  id: string;
  date: string; // "2025-10-28"
  type: "income" | "expense";
  category: string;
  memo: string;
  amount: number;
};

export function useLedgerStore() {
  const [items, setItems] = useState<LedgerItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (e) {
        console.warn("ledger_items parse 실패, 초기화합니다.", e);
      }
    }
    setReady(true);
  }, []);

  function persist(next: LedgerItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem(data: Omit<LedgerItem, "id">) {
    const newItem: LedgerItem = {
      id: crypto.randomUUID(),
      ...data,
    };
    const next = [newItem, ...items];
    persist(next);
  }

  function removeItem(id: string) {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  }

  // ✅ 여기 추가: 항목 수정
  function updateItem(
    id: string,
    patch: Partial<Omit<LedgerItem, "id">>
  ) {
    const next = items.map((it) =>
      it.id === id ? { ...it, ...patch } : it
    );
    persist(next);
  }

  // 전체 데이터 export
  function exportData(): string {
    return JSON.stringify(items, null, 2);
  }

  // 전체 데이터 import
  function importData(rawItems: unknown): { ok: boolean; message?: string } {
    if (!Array.isArray(rawItems)) {
      return { ok: false, message: "형식이 올바르지 않습니다. (배열 아님)" };
    }

    for (const it of rawItems) {
      if (
        typeof it !== "object" ||
        it === null ||
        typeof (it as any).id !== "string" ||
        typeof (it as any).date !== "string" ||
        !["income", "expense"].includes((it as any).type) ||
        typeof (it as any).amount !== "number"
      ) {
        return { ok: false, message: "데이터 구조가 맞지 않습니다." };
      }
    }

    persist(rawItems as LedgerItem[]);
    return { ok: true };
  }

  return {
    ready,
    items,
    addItem,
    removeItem,
    updateItem,   // ✅ 반드시 리턴에 포함
    exportData,
    importData,
  };
}