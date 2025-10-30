import { useState, useEffect } from "react";

const STORAGE_KEY = "memo_items";

export type MemoItem = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export function useMemoStore() {
  const [items, setItems] = useState<MemoItem[]>([]);
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
        console.warn("memo_items parse 실패", e);
      }
    }
    setReady(true);
  }, []);

  function persist(next: MemoItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function createMemo(): MemoItem {
    const now = new Date().toISOString();
    const newItem: MemoItem = {
      id: crypto.randomUUID(),
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    const next = [newItem, ...items];
    persist(next);
    return newItem; // 객체 자체를 반환
  }

  function updateMemo(id: string, content: string) {
    const next = items.map((it) =>
      it.id === id ? { ...it, content, updatedAt: new Date().toISOString() } : it
    );
    persist(next);
  }

  function deleteMemo(id: string) {
    const next = items.filter((it) => it.id !== id);
    persist(next);
  }

  function exportData(): string {
    return JSON.stringify(items, null, 2);
  }

  function importData(rawItems: unknown): { ok: boolean; message?: string } {
    if (!Array.isArray(rawItems)) {
      return { ok: false, message: "형식이 올바르지 않습니다." };
    }

    for (const it of rawItems) {
      if (
        typeof it !== "object" ||
        it === null ||
        typeof (it as any).id !== "string" ||
        typeof (it as any).content !== "string"
      ) {
        return { ok: false, message: "데이터 구조가 맞지 않습니다." };
      }
    }

    persist(rawItems as MemoItem[]);
    return { ok: true };
  }

  return {
    ready,
    items,
    createMemo,
    updateMemo,
    deleteMemo,
    exportData,
    importData,
  };
}