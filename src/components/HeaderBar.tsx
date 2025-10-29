import React from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeaderBar() {
  return (
    <header className="w-full bg-[#1a1a1a] border-b border-gray-400 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/app" className="text-base font-bold text-gray-100 cursor-pointer hover:text-blue-600 transition-colors">
          Account Book
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-300">
          <button className="hover:text-gray-900 transition-colors">
            가계부
          </button>
          <button className="hover:text-gray-900 transition-colors">
            통계
          </button>
          <button className="hover:text-gray-900 transition-colors">
            백업
          </button>
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          aria-label="menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}