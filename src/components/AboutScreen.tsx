import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-[#1a1a1a] dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* 상단 뒤로가기 바 */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-[#ed374f] mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>이전으로</span>
        </button>

        {/* 본문 */}
        <h1 className="text-2xl font-bold mb-3">서비스 소개</h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
          이 서비스는 별도 앱 설치 없이, 브라우저만으로 간단하게 쓸 수 있는
          개인 용돈·가계부 웹앱입니다. 닉네임과 숫자 8자리 비밀번호만으로
          접속하여, 수입·지출과 메모를 빠르게 기록할 수 있습니다.
        </p>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-2 leading-relaxed">
          수입·지출 내역 입력, 기간·카테고리별 필터링, 통계 화면, 메모장 기능까지
          제공하여, 일단 가볍게 시작해서 점점 자신의 패턴을 파악할 수 있도록
          설계되어 있습니다.
        </p>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 leading-relaxed">
          기록된 데이터는 Supabase와 백엔드(Fiber)를 통해 안전하게 저장되며,
          서비스 운영 및 개선 외의 목적으로는 사용하지 않습니다. 자세한 내용은
          개인정보 처리방침을 참고해 주세요.
        </p>
      </div>
    </div>
  );
}
