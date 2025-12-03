import { supabase } from "./supabaseClient";

export type LedgerRow = {
  id: string;
  user_id: string;
  date: string; // "YYYY-MM-DD"
  type: "income" | "expense";
  category: string;
  memo: string | null;
  amount: number;
  created_at: string;
};

export type LedgerInsertInput = {
  date: string;
  type: "income" | "expense";
  category: string;
  memo?: string;
  amount: number;
};

export type LedgerUpdateInput = Partial<{
  date: string;
  type: "income" | "expense";
  category: string;
  memo: string | null;
  amount: number;
}>;

/** 해당 user의 전체 거래 불러오기 */
export async function fetchLedgerRows(userId: string): Promise<LedgerRow[]> {
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchLedgerRows error", error);
    throw error;
  }
  return (data ?? []) as LedgerRow[];
}

/** 한 건 추가 */
export async function insertLedgerRow(
  userId: string,
  input: LedgerInsertInput
): Promise<LedgerRow> {
  const { data, error } = await supabase
    .from("ledger_entries")
    .insert({
      user_id: userId,
      date: input.date,
      type: input.type,
      category: input.category,
      memo: input.memo ?? null,
      amount: input.amount,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("insertLedgerRow error", error);
    throw error;
  }

  return data as LedgerRow;
}

/** 한 건 삭제 */
export async function deleteLedgerRow(
  userId: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("ledger_entries")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);

  if (error) {
    console.error("deleteLedgerRow error", error);
    throw error;
  }
}

/** 한 건 업데이트 (금액/카테고리/메모 등) */
export async function updateLedgerRow(
  userId: string,
  id: string,
  patch: LedgerUpdateInput
): Promise<LedgerRow> {
  const cleanPatch: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) {
      cleanPatch[key] = value;
    }
  }

  const { data, error } = await supabase
    .from("ledger_entries")
    .update(cleanPatch)
    .eq("user_id", userId)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("updateLedgerRow error", error);
    throw error;
  }

  return data as LedgerRow;
}

/** 해당 user의 모든 거래 내역 삭제 */
export async function deleteAllLedgerRows(userId: string): Promise<void> {
  const { error } = await supabase
    .from("ledger_entries")
    .delete()
    .eq("user_id", userId);

  if (error) {
    console.error("deleteAllLedgerRows error", error);
    throw error;
  }
}