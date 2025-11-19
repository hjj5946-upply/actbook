import { useMemo, useState } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import type { LedgerItem } from "../hooks/useLedgerStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DailyData = {
  day: number;
  income: number;
  expense: number;
};

type CategoryData = {
  name: string;
  value: number;
};

const EXPENSE_COLORS = [
  "#f97373",
  "#f59e0b",
  "#22c55e",
  "#0ea5e9",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#eab308",
];

function getCurrentMonthValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`; // "YYYY-MM"
}

function getDaysInMonth(monthStr: string): number {
  const [year, month] = monthStr.split("-").map(Number);
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function StatsScreen() {
  const { ready, items } = useLedgerStoreContext();
  const [month, setMonth] = useState(getCurrentMonthValue());

  const monthItems = useMemo(() => {
    if (!month) return [] as LedgerItem[];
    return items.filter((it) => it.date.startsWith(month));
  }, [items, month]);

  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const it of monthItems) {
      if (it.type === "income") {
        income += it.amount;
      } else {
        expense += it.amount;
      }
    }
    return { totalIncome: income, totalExpense: expense };
  }, [monthItems]);

  const dailyData: DailyData[] = useMemo(() => {
    const days = getDaysInMonth(month);
    const base: DailyData[] = Array.from({ length: days }, (_, idx) => ({
      day: idx + 1,
      income: 0,
      expense: 0,
    }));

    for (const it of monthItems) {
      const day = Number(it.date.slice(8, 10)); // "YYYY-MM-DD" → DD
      if (!day || day < 1 || day > days) continue;
      const target = base[day - 1];
      if (it.type === "income") {
        target.income += it.amount;
      } else {
        target.expense += it.amount;
      }
    }

    return base;
  }, [monthItems, month]);

  const categoryData: CategoryData[] = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of monthItems) {
      if (it.type !== "expense") continue;
      const key = it.category || "기타";
      map.set(key, (map.get(key) ?? 0) + it.amount);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [monthItems]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        가계부 불러오는 중...
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-4">
        {/* 상단: 월 선택 + 요약 카드 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              통계
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              선택한 월 기준 수입·지출 및 카테고리별 지출 현황
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-700 dark:text-gray-300">월 선택</span>
            <input
              type="month"
              className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs outline-none
                         focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                         dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">수입 합계</div>
            <div className="text-base font-semibold" style={{ color: "#4fc785ff" }}>
              {formatKRW(totalIncome)}
            </div>
          </div>
          <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">지출 합계</div>
            <div className="text-base font-semibold" style={{ color: "#f15b6fff" }}>
              -{formatKRW(totalExpense)}
            </div>
          </div>
          <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">남은 금액</div>
            <div className="text-base font-semibold" style={{ color: "#168effff" }}>
              {formatKRW(totalIncome - totalExpense)}
            </div>
          </div>
        </div>

        {/* 메인 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 일자별 막대 차트 */}
          <div className="lg:col-span-2 bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              일자별 수입·지출
            </h2>
            {monthItems.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
                선택한 월에 거래 내역이 없습니다.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#4b5563" />
                    <YAxis stroke="#4b5563" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #4b5563",
                        fontSize: "12px",
                        color: "#e5e7eb",
                      }}
                      formatter={(value: any) =>
                        `${Number(value).toLocaleString("ko-KR")}원`
                      }
                    />
                    <Legend />
                    <Bar dataKey="expense" name="지출" fill="#f15b6fff" stackId="a" />
                    <Bar dataKey="income" name="수입" fill="#4fc785ff" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 카테고리별 지출 파이차트 */}
          <div className="bg-white text-gray-900 dark:bg-[#2b2b2b]/95 dark:text-gray-100 rounded-xl p-4 shadow-[0_0_6px_rgba(0,0,0,0.12)] dark:shadow-[0_0_3px_rgba(255,255,255,0.25)]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              카테고리별 지출 비율
            </h2>
            {categoryData.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
                지출 내역이 없습니다.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      stroke="#1e1e1e"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #4b5563",
                        fontSize: "12px",
                        color: "#e5e7eb",
                      }}
                      formatter={(value: any, name: any) => [
                        `${Number(value).toLocaleString("ko-KR")}원`,
                        name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
