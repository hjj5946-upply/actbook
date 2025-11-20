import { Outlet } from "react-router-dom";
import HeaderBar from "./HeaderBar";
import PolicyLinks from "./PolicyLinks";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-[#1a1a1a] dark:text-gray-100">
      <HeaderBar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 🔹 PC(데스크톱)에서만 보이는 푸터 */}
      <footer className="hidden md:block border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-[11px] text-gray-500 dark:text-gray-400">
          <PolicyLinks className="justify-center mb-1" />
          <div>© {new Date().getFullYear()} 용돈기입장 (가칭)</div>
        </div>
      </footer>
    </div>
  );
}
