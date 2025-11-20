import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyScreen() {
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
        <h1 className="text-2xl font-bold mb-3">개인정보 처리방침</h1>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          이 개인정보 처리방침은 서비스 운영 상황에 따라 변경될 수 있으며,
          중요한 변경이 있을 경우 서비스 공지 등을 통해 안내드립니다.
        </p>

        <section className="space-y-3 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="font-semibold mb-1 text-base">1. 수집하는 정보</h2>
            <p>
              이 서비스는 회원가입 및 이용 과정에서 아래 정보들을 수집·저장할 수
              있습니다.
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>닉네임, 비밀번호(숫자 8자리)</li>
              <li>가계부 데이터: 날짜, 금액, 구분(수입/지출), 카테고리, 메모</li>
              <li>메모장 데이터: 사용자가 직접 작성한 메모 내용</li>
              <li>서비스 이용 과정에서 자동으로 생성되는 로그 정보(오류 로그 등)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">
              2. 개인정보의 이용 목적
            </h2>
            <p>수집된 정보는 다음 목적 범위 내에서만 사용됩니다.</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>가계부 및 메모 데이터 저장, 조회, 통계 제공</li>
              <li>서비스 유지·관리 및 기능 개선</li>
              <li>오류 분석 및 보안, 안정성 확보</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">
              3. 개인정보의 보관 및 파기
            </h2>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>
                사용자가 서비스를 이용하는 동안, 계정 및 가계부·메모 데이터는
                Supabase에 안전하게 저장됩니다.
              </li>
              <li>
                사용자가 직접 데이터 삭제 또는 탈퇴를 요청한 경우, 관련 데이터는
                복구가 불가능하도록 파기되거나 서비스 운영에 필요한 최소 범위만
                남기고 삭제됩니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">
              4. 제3자 제공 및 외부 전송
            </h2>
            <p>
              법령에 특별한 규정이 있는 경우를 제외하고, 사용자의 동의 없이
              개인정보를 제3자에게 판매하거나 제공하지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">
              5. 쿠키 및 추적 기술
            </h2>
            <p>
              추후 광고(예: Google AdSense) 또는 분석 도구가 도입될 경우,
              서비스는 쿠키나 유사한 기술을 사용할 수 있습니다. 이 경우 쿠키 사용
              목적과 거부 방법 등은 별도 공지 또는 본 방침 개정을 통해 안내합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">
              6. 이용자 권리
            </h2>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>자신의 가계부·메모 데이터를 조회·수정·삭제할 수 있습니다.</li>
              <li>
                개인정보와 관련된 문의·요청은 별도 안내된 연락처를 통해 요청할 수
                있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-base">7. 문의처</h2>
            <p>
              개인정보 처리에 관한 문의, 요청, 불만 처리는 추후 별도 안내되는
              연락처 또는 이메일을 통해 접수받을 예정입니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
