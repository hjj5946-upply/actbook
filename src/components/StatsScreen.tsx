import { useMemo, useState } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";
import type { LedgerItem } from "../hooks/useLedgerStore";
import { formatKRW } from "../utils/format";

type ViewMode = "month" | "year" | "range";
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

function getCurrentYearValue() {
  const now = new Date();
  return String(now.getFullYear()); // "YYYY"
}

function getCurrentDateRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return {
    start: firstDay.toISOString().slice(0, 10),
    end: lastDay.toISOString().slice(0, 10),
  };
}

function getDaysInMonth(monthStr: string): number {
  const [year, month] = monthStr.split("-").map(Number);
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

function getDaysInRange(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export default function StatsScreen() {
  const { ready, items } = useLedgerStoreContext();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [month, setMonth] = useState(getCurrentMonthValue());
  const [year, setYear] = useState(getCurrentYearValue());
  const [dateRange, setDateRange] = useState(getCurrentDateRange());

  // 필터링된 아이템들
  const filteredItems = useMemo(() => {
    if (viewMode === "month") {
      if (!month) return [] as LedgerItem[];
      return items.filter((it) => it.date.startsWith(month));
    } else if (viewMode === "year") {
      if (!year) return [] as LedgerItem[];
      return items.filter((it) => it.date.startsWith(year));
    } else {
      // range
      if (!dateRange.start || !dateRange.end) return [] as LedgerItem[];
      return items.filter(
        (it) => it.date >= dateRange.start && it.date <= dateRange.end
      );
    }
  }, [items, viewMode, month, year, dateRange]);

  const { totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const it of filteredItems) {
      if (it.type === "income") {
        income += it.amount;
      } else {
        expense += it.amount;
      }
    }
    return { totalIncome: income, totalExpense: expense };
  }, [filteredItems]);

  const dailyData: DailyData[] = useMemo(() => {
    if (viewMode === "month") {
      const days = getDaysInMonth(month);
      const base: DailyData[] = Array.from({ length: days }, (_, idx) => ({
        day: idx + 1,
        income: 0,
        expense: 0,
      }));

      for (const it of filteredItems) {
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
    } else if (viewMode === "year") {
      // 연도별: 월별 집계
      const base: DailyData[] = Array.from({ length: 12 }, (_, idx) => ({
        day: idx + 1, // 1-12 (월)
        income: 0,
        expense: 0,
      }));

      for (const it of filteredItems) {
        const month = Number(it.date.slice(5, 7)); // "YYYY-MM-DD" → MM
        if (!month || month < 1 || month > 12) continue;
        const target = base[month - 1];
        if (it.type === "income") {
          target.income += it.amount;
        } else {
          target.expense += it.amount;
        }
      }

      return base;
    } else {
      // range: 일자별 집계
      if (!dateRange.start || !dateRange.end) return [];
      const days = getDaysInRange(dateRange.start, dateRange.end);
      const startDate = new Date(dateRange.start);
      const base: DailyData[] = Array.from({ length: days }, (_, idx) => ({
        day: idx + 1,
        income: 0,
        expense: 0,
      }));

      for (const it of filteredItems) {
        const itemDate = new Date(it.date);
        const diffTime = itemDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays >= days) continue;
        const target = base[diffDays];
        if (it.type === "income") {
          target.income += it.amount;
        } else {
          target.expense += it.amount;
        }
      }

      return base;
    }
  }, [filteredItems, viewMode, month, year, dateRange]);

  const categoryData: CategoryData[] = useMemo(() => {
    const map = new Map<string, number>();
    for (const it of filteredItems) {
      if (it.type !== "expense") continue;
      const key = it.category || "기타";
      map.set(key, (map.get(key) ?? 0) + it.amount);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredItems]);

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
        {/* 상단: 모드 선택 + 필터 + 요약 카드 */}
        <div className="flex flex-col gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              통계
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              수입·지출 및 카테고리별 지출 현황
            </p>
          </div>

          {/* 모드 선택 탭 */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "month"
                  ? "text-[#ed374f] border-b-2 border-[#ed374f]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              월별
            </button>
            <button
              onClick={() => setViewMode("year")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "year"
                  ? "text-[#ed374f] border-b-2 border-[#ed374f]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              연도별
            </button>
            <button
              onClick={() => setViewMode("range")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "range"
                  ? "text-[#ed374f] border-b-2 border-[#ed374f]"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              기간별
            </button>
          </div>

          {/* 필터 입력 */}
          <div className="flex items-center gap-3 flex-wrap">
            {viewMode === "month" && (
              <>
                <span className="text-xs text-gray-700 dark:text-gray-300">월 선택</span>
                <input
                  type="month"
                  className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs outline-none
                             focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                             dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </>
            )}
            {viewMode === "year" && (
              <>
                <span className="text-xs text-gray-700 dark:text-gray-300">연도 선택</span>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs outline-none
                             focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                             dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100 w-24"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </>
            )}
            {viewMode === "range" && (
              <>
                <span className="text-xs text-gray-700 dark:text-gray-300">시작일</span>
                <input
                  type="date"
                  className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs outline-none
                             focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                             dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">종료일</span>
                <input
                  type="date"
                  className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 text-xs outline-none
                             focus:ring-2 focus:ring-[#ed374f] focus:border-transparent
                             dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-gray-100"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </>
            )}
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
              {viewMode === "year"
                ? "월별 수입·지출"
                : viewMode === "range"
                ? "일자별 수입·지출"
                : "일자별 수입·지출"}
            </h2>
            {filteredItems.length === 0 ? (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
                {viewMode === "year"
                  ? "선택한 연도에 거래 내역이 없습니다."
                  : viewMode === "range"
                  ? "선택한 기간에 거래 내역이 없습니다."
                  : "선택한 월에 거래 내역이 없습니다."}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      label={
                        viewMode === "year"
                          ? { value: "월", position: "insideBottom", offset: -5 }
                          : undefined
                      }
                    />
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
                      labelFormatter={(label: any) =>
                        viewMode === "year"
                          ? `${label}월`
                          : viewMode === "range"
                          ? `${dateRange.start}부터 ${label}일차`
                          : `${label}일`
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
