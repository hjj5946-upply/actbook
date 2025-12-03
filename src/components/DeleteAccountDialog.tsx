import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

type DeleteAccountDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  nickname: string;
};

export default function DeleteAccountDialog({
  isOpen,
  onClose,
  onConfirm,
  nickname,
}: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmNickname, setConfirmNickname] = useState("");

  if (!isOpen) return null;

  const isConfirmEnabled = confirmNickname.trim() === nickname.trim() && !isDeleting;

  async function handleConfirm() {
    if (!isConfirmEnabled) return;

    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
      // 성공 시 onClose는 상위에서 처리 (로그아웃 후 이동)
    } catch (e) {
      console.error("deleteAccount error", e);
      setError("회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsDeleting(false);
    }
  }

  function handleClose() {
    if (isDeleting) return;
    setConfirmNickname("");
    setError(null);
    onClose();
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* 다이얼로그 */}
        <div
          className="bg-white dark:bg-[#2b2b2b] rounded-xl shadow-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                회원탈퇴
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              disabled={isDeleting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 본문 */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              정말로 회원탈퇴를 하시겠습니까?
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
                ⚠️ 주의사항
              </p>
              <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                <li>모든 거래 내역이 영구적으로 삭제됩니다.</li>
                <li>계정 정보가 완전히 삭제됩니다.</li>
                <li>이 작업은 되돌릴 수 없습니다.</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              탈퇴하려면 <strong className="text-gray-900 dark:text-gray-100">"{nickname}"</strong>을(를) 입력해주세요.
            </p>
            <input
              type="text"
              value={confirmNickname}
              onChange={(e) => setConfirmNickname(e.target.value)}
              placeholder="닉네임 입력"
              disabled={isDeleting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmEnabled}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

