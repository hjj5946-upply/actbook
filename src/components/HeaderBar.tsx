import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePasswordGateContext } from "../PasswordGateContext";

export default function HeaderBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = usePasswordGateContext();

  const isActive = (path: string) => location.pathname.includes(path);

  function handleLogout() {
    logout();
    navigate("/lock", { replace: true });
  }

  return (
    <>
      <header className="w-full bg-[#1a1a1a] border-b border-gray-400 text-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* 좌측 로고 */}
          <Link
            to="/app"
            className="text-base font-bold text-gray-100 cursor-pointer hover:text-[#ed374f] transition-colors"
          >
            Account Book
          </Link>

          {/* PC 메뉴 */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-200">

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

            <button className="hover:text-[#ed374f] transition-colors text-gray-500 cursor-not-allowed">
              개발중
            </button>
            
            {currentUser && (
              <span className="text-gray-300 text-xs">
                {currentUser.nickname} 님
              </span>
            )}

            {/* 🔥 여기 로그아웃 버튼 추가 */}
            <button
              onClick={handleLogout}
              className="ml-3 px-3 py-1.5 rounded bg-[#ed374f] hover:bg-[#d21731] text-white text-xs transition-colors shadow-sm"
            >
              로그아웃
            </button>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-100 hover:bg-[#ed374f] transition-colors"
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
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 슬라이드 메뉴 */}
          <div className="fixed top-0 right-0 h-full w-64 bg-[#2b2b2b] shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out">

            {/* 닫기 버튼 */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-100 hover:text-[#ed374f] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 메뉴 항목 */}
            <nav className="flex flex-col px-4 gap-2">
              <Link
                to="/app/ledger"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("ledger")
                    ? "bg-[#ed374f] text-white"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                가계부
              </Link>

              <Link
                to="/app/memo"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive("memo")
                    ? "bg-[#ed374f] text-white"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                메모장(개발중)
              </Link>

              {/* <button
                className="px-4 py-3 rounded-lg text-sm font-medium text-gray-500 text-left cursor-not-allowed"
                disabled
              >
                개발중
              </button> */}
              
              {currentUser && (
                <div className="text-gray-300 text-sm px-4 mb-2">
                  {currentUser.nickname} 님
                </div>
              )}

              {/* 🔥 모바일 슬라이드 메뉴 아래쪽에 로그아웃 추가 */}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="mt-4 px-4 py-3 rounded-lg text-sm font-medium bg-[#ed374f] text-white hover:bg-[#d21731] transition-colors"
              >
                로그아웃
              </button>

            </nav>
          </div>
        </>
      )}
    </>
  );
}
