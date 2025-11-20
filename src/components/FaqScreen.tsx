import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const faqs = [
  {
    q: "회원가입 시 어떤 정보가 필요한가요?",
    a: "닉네임과 숫자 8자리 비밀번호만으로 이용할 수 있습니다. 이메일이나 휴대폰 번호 입력은 없습니다.",
  },
  {
    q: "데이터는 어디에 저장되나요?",
    a: "가계부 및 메모 데이터는 Supabase와 백엔드 서버에 저장되며, 서비스 운영 및 기능 제공 목적에 한해 사용됩니다.",
  },
  {
    q: "기록한 데이터는 제가 직접 삭제할 수 있나요?",
    a: "가계부 내역과 메모는 화면에서 직접 수정·삭제할 수 있으며, 삭제된 데이터는 복구가 어렵습니다.",
  },
  {
    q: "광고가 붙을 수도 있나요?",
    a: "향후 트래픽 증가 시 Google AdSense 등 광고가 추가될 수 있습니다. 이 경우 화면 내에 명확히 표시되며, 개인정보 처리방침을 통해 관련 내용을 안내할 예정입니다.",
  },
  {
    q: "PC와 모바일에서 모두 사용할 수 있나요?",
    a: "네. 설치형 앱이 아니라 브라우저 기반 웹앱이기 때문에, PC·모바일 브라우저에서 모두 이용할 수 있습니다.",
  },
];

export default function FaqScreen() {
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
        <h1 className="text-2xl font-bold mb-3">자주 묻는 질문 (FAQ)</h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
          용돈기입장 웹앱을 사용하면서 자주 궁금해하실 만한 내용들을 정리했습니다.
        </p>

        <div className="space-y-3">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-lg bg-white dark:bg-[#2b2b2b]/95 shadow-sm px-4 py-3"
            >
              <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
                Q. {item.q}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {item.a}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          위 내용은 서비스 개선 과정에서 계속 업데이트될 수 있습니다. 개인정보와
          관련된 내용은{" "}
          <span className="font-semibold">개인정보 처리방침</span>을 참고해 주세요.
        </p>
      </div>
    </div>
  );
}
