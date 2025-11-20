import { Link } from "react-router-dom";

export default function PolicyLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Link
        to="/about"
        className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#ed374f] hover:underline"
      >
        서비스 소개
      </Link>
      <Link
        to="/privacy"
        className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#ed374f] hover:underline"
      >
        개인정보 처리방침
      </Link>
      <Link
        to="/faq"
        className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-[#ed374f] hover:underline"
      >
        FAQ
      </Link>
    </div>
  );
}
