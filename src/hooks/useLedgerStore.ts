// hooks/useLedgerStore.ts
import { useState, useEffect } from "react";
import {
  fetchLedgerRows,
  insertLedgerRow,
  deleteLedgerRow,
  updateLedgerRow,
  type LedgerRow,
  type LedgerInsertInput,
} from "./ledgerApi";

export type LedgerItem = {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  memo: string;
  amount: number;
};

type ImportResult = { ok: boolean; message?: string };

// userId: 현재 로그인한 유저의 id (없으면 null)
export function useLedgerStore(userId: string | null) {
  const [items, setItems] = useState<LedgerItem[]>([]);
  const [ready, setReady] = useState(false);

  // userId가 바뀔 때마다 해당 유저의 ledger를 Supabase에서 불러온다.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setReady(false);
      setItems([]);

      if (!userId) {
        // 로그인 전에는 비워두고 바로 ready
        setReady(true);
        return;
      }

      try {
        const rows: LedgerRow[] = await fetchLedgerRows(userId);
        if (cancelled) return;

        const mapped: LedgerItem[] = rows.map((row) => ({
          id: row.id,
          date: row.date,
          type: row.type,
          category: row.category,
          memo: row.memo ?? "",
          amount: row.amount,
        }));

        setItems(mapped);
      } catch (e) {
        console.error("load ledger error", e);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Supabase → state 동기화 헬퍼
  function replaceAll(newItems: LedgerItem[]) {
    setItems(newItems);
  }

  // 추가
  async function addItem(data: Omit<LedgerItem, "id">): Promise<void> {
    if (!userId) {
      console.warn("addItem: userId 없음");
      return;
    }

    const input: LedgerInsertInput = {
      date: data.date,
      type: data.type,
      category: data.category,
      memo: data.memo,
      amount: data.amount,
    };

    try {
      const row = await insertLedgerRow(userId, input);
      const newItem: LedgerItem = {
        id: row.id,
        date: row.date,
        type: row.type,
        category: row.category,
        memo: row.memo ?? "",
        amount: row.amount,
      };

      setItems((prev) => [newItem, ...prev]);
    } catch (e) {
      console.error("addItem error", e);
    }
  }

  // 삭제
  async function removeItem(id: string): Promise<void> {
    if (!userId) {
      console.warn("removeItem: userId 없음");
      return;
    }

    try {
      await deleteLedgerRow(userId, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      console.error("removeItem error", e);
    }
  }

  // 수정 (지금은 amount/category/memo 쪽을 주로 사용)
  async function updateItem(
    id: string,
    patch: Partial<Omit<LedgerItem, "id">>
  ): Promise<void> {
    if (!userId) {
      console.warn("updateItem: userId 없음");
      return;
    }

    try {
      const row = await updateLedgerRow(userId, id, {
        date: patch.date,
        type: patch.type,
        category: patch.category,
        memo: patch.memo,
        amount: patch.amount,
      });

      const updated: LedgerItem = {
        id: row.id,
        date: row.date,
        type: row.type,
        category: row.category,
        memo: row.memo ?? "",
        amount: row.amount,
      };

      setItems((prev) =>
        prev.map((it) => (it.id === id ? updated : it))
      );
    } catch (e) {
      console.error("updateItem error", e);
    }
  }

  // 전체 export (그냥 현재 state를 JSON으로 뽑기만 함 – DB와는 이미 동기)
  function exportData(): string {
    return JSON.stringify(items, null, 2);
  }

  // import는 당장은 기존 형태 유지 (state만 교체)
  // 필요하면 여기에 Supabase 일괄 insert 로직도 추가 가능
  function importData(rawItems: unknown): ImportResult {
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

    // ⚠ 여기서는 state만 교체 (Supabase에는 반영 안 됨)
    replaceAll(rawItems as LedgerItem[]);
    return { ok: true };
  }

  return {
    ready,
    items,
    addItem,
    removeItem,
    updateItem,
    exportData,
    importData,
  };
}
