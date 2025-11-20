import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePasswordGateContext } from "../PasswordGateContext";
import { useTheme } from "../ThemeContext";
import PolicyLinks from "./PolicyLinks";

export default function HeaderBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = usePasswordGateContext();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname.includes(path);

  function handleLogout() {
    logout();
    navigate("/lock", { replace: true });
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      {/* 상단 헤더 (PC + 모바일 공통) */}
      <header className="w-full border-b border-gray-300 bg-white text-gray-900 dark:bg-[#1a1a1a] dark:border-gray-400 dark:text-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* 좌측: (모바일) 뒤로가기 + 로고 */}
          <div className="flex items-center gap-2">
            <Link
              to="/app"
              className="text-base font-bold cursor-pointer text-gray-900 hover:text-[#ed374f] dark:text-gray-100 transition-colors"
            >
              Account Book
            </Link>
          </div>

          {/* PC 메뉴 */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Link
              to="/app/ledger"
              className={`hover:text-[#ed374f] transition-colors ${
                isActive("ledger") ? "text-[#ed374f]" : ""
              }`}
            >
              가계부
            </Link>

            <Link
              to="/app/memo"
              className={`hover:text-[#ed374f] transition-colors ${
                isActive("memo") ? "text-[#ed374f]" : ""
              }`}
            >
              메모장
            </Link>

            <Link
              to="/app/stats"
              className={`hover:text-[#ed374f] transition-colors ${
                isActive("stats") ? "text-[#ed374f]" : ""
              }`}
            >
              통계
            </Link>

            {currentUser && (
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {currentUser.nickname} 님
              </span>
            )}

            {/* 테마 토글 버튼 */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 dark:border-gray-500 hover:border-[#ed374f] hover:text-[#ed374f] transition-colors"
              aria-label="toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 rounded bg-[#ed374f] hover:bg-[#d21731] text-white text-xs transition-colors shadow-sm"
            >
              로그아웃
            </button>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-800 dark:border-gray-200 dark:text-gray-100 hover:bg-[#ed374f] hover:text-white transition-colors"
            aria-label="menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 모바일 슬라이드 메뉴 */}
      {isMenuOpen && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleCloseMenu}
          />

          {/* 슬라이드 패널 */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#2b2b2b] shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* 상단: 테마 토글 + 닫기 버튼 */}
            <div className="flex items-center justify-between px-4 pt-4 pb-6">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-100 hover:border-[#ed374f] hover:text-[#ed374f] transition-colors"
                aria-label="toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleCloseMenu}
                className="text-gray-700 dark:text-gray-100 hover:text-[#ed374f] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 메뉴 항목 */}
            <nav className="flex flex-col px-4 gap-2 pb-4">
              <Link
                to="/app/ledger"
                onClick={handleCloseMenu}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("ledger")
                    ? "bg-[#ed374f] text-white"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                가계부
              </Link>
{/* 
              <Link
                to="/app/memo"
                onClick={handleCloseMenu}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("memo")
                    ? "bg-[#ed374f] text-white"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                메모장(개발중)
              </Link> */}

              <Link
                to="/app/stats"
                onClick={handleCloseMenu}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("stats")
                    ? "bg-[#ed374f] text-white"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                통계
              </Link>

              {currentUser && (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 px-1">
                  {currentUser.nickname} 님
                </div>
              )}

              {/* 로그아웃 버튼 */}
              <button
                onClick={() => {
                  handleCloseMenu();
                  handleLogout();
                }}
                className="mt-4 px-4 py-3 rounded-lg text-sm font-medium bg-[#ed374f] text-white hover:bg-[#d21731] transition-colors"
              >
                로그아웃
              </button>

              {/* 모바일 전용 정책/소개 링크 */}
              <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-600">
                <PolicyLinks className="justify-start" />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
