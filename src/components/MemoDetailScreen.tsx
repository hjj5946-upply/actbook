import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { useMemoStoreContext } from "../MemoStoreContext";
import type { MemoItem } from "../hooks/useMemoStore";

export default function MemoDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, updateMemo, deleteMemo } = useMemoStoreContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [content, setContent] = useState("");
  const [currentMemo, setCurrentMemo] = useState<MemoItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 👈 추가

  // 메모 로드 (한 번만)
  useEffect(() => {
    if (isInitialized) return; // 👈 이미 초기화되었으면 스킵

    if (location.state?.memo) {
      setCurrentMemo(location.state.memo);
      setContent(location.state.memo.content);
      setIsInitialized(true);
    } else if (id) {
      const found = items.find((m) => m.id === id);
      if (found) {
        setCurrentMemo(found);
        setContent(found.content);
        setIsInitialized(true);
      } else {
        navigate("/app/memo", { replace: true });
      }
    }
  }, [id, location.state, items, navigate, isInitialized]);

  // 자동 포커스
  useEffect(() => {
    if (textareaRef.current && currentMemo && isInitialized) {
      textareaRef.current.focus();
      const length = content.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [currentMemo, isInitialized]);

  // 변경 감지
  useEffect(() => {
    if (currentMemo && content !== currentMemo.content) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [content, currentMemo]);

  function handleSave() {
  if (!id || !currentMemo) return;

  if (content.trim() === "") {
    if (confirm("내용이 비어있습니다. 메모를 삭제하시겠습니까?")) {
      deleteMemo(id);
      navigate("/app/memo");
    }
    return;
  }

  updateMemo(id, content);
  
  navigate("/app/memo");
}

  function handleBack() {
    if (hasChanges) {
      if (confirm("저장하지 않은 내용이 있습니다. 나가시겠습니까?")) {
        if (content.trim() === "") {
          deleteMemo(id!);
        }
        navigate("/app/memo");
      }
    } else {
      if (content.trim() === "") {
        deleteMemo(id!);
      }
      navigate("/app/memo");
    }
  }

  function handleDelete() {
    if (!id) return;

    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMemo(id);
      navigate("/app/memo");
    }
  }

  function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
  }

  // 텍스트 영역 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  if (!currentMemo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        메모를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      {/* 헤더 */}
      <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-700 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-[#ed374f] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {/* 저장 버튼 */}
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors ${
                hasChanges
                  ? "bg-[#ed374f] hover:bg-[#d21731] text-white"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </button>

            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-transparent border-2 border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>삭제</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메모 에디터 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="메모를 입력하세요&#10;첫 줄이 제목이 됩니다"
          className="w-full bg-transparent text-gray-100 placeholder-gray-600 outline-none resize-none text-base leading-relaxed"
          style={{
            minHeight: "calc(100vh - 200px)",
            fontFamily: "inherit",
          }}
        />

        {/* 메타 정보 */}
        <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-500 space-y-1">
          <div>작성: {new Date(currentMemo.createdAt).toLocaleString("ko-KR")}</div>
          <div>수정: {new Date(currentMemo.updatedAt).toLocaleString("ko-KR")}</div>
          <div>글자 수: {content.length.toLocaleString()}</div>
        </div>
      </div>

      {/* 변경사항 표시 */}
      {hasChanges && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-yellow-500">
          저장되지 않은 변경사항이 있습니다
        </div>
      )}
    </div>
  );
}