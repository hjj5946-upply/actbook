import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useMemoStoreContext } from "../MemoStoreContext";

export default function MemoDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, addItem, updateItem, removeItem } = useMemoStoreContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const isNew = id === "new";
  const currentMemo = !isNew ? items.find((m) => m.id === id) : null;

  // 기존 메모 로드
  useEffect(() => {
    if (currentMemo) {
      setTitle(currentMemo.title);
      setContent(currentMemo.content);
    }
  }, [currentMemo]);

  // 존재하지 않는 메모
  useEffect(() => {
    if (!isNew && !currentMemo && items.length > 0) {
      navigate("/app/memo");
    }
  }, [isNew, currentMemo, items, navigate]);

  function handleSave() {
    if (!title.trim()) {
      setMessage("제목을 입력하세요.");
      return;
    }

    if (isNew) {
      addItem({ title: title.trim(), content: content.trim() });
      setMessage("메모가 저장되었습니다.");
      setTimeout(() => navigate("/app/memo"), 1000);
    } else if (currentMemo) {
      updateItem(currentMemo.id, {
        title: title.trim(),
        content: content.trim(),
      });
      setMessage("메모가 수정되었습니다.");
    }
  }

  function handleDelete() {
    if (!currentMemo) return;
    
    if (confirm("정말 삭제하시겠습니까?")) {
      removeItem(currentMemo.id);
      navigate("/app/memo");
    }
  }

  function handleBack() {
    if (title.trim() || content.trim()) {
      if (confirm("저장하지 않은 내용이 있습니다. 나가시겠습니까?")) {
        navigate("/app/memo");
      }
    } else {
      navigate("/app/memo");
    }
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-[#ed374f] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>목록으로</span>
          </button>

          <div className="flex gap-2">
            {!isNew && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-transparent border-2 border-red-500 hover:border-red-700 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>삭제</span>
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-[#ed374f] hover:bg-[#d21731] text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>저장</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-gray-700 rounded text-sm text-gray-200">
            {message}
          </div>
        )}

        {/* 메모 입력 영역 */}
        <div className="bg-[#2b2b2b]/95 rounded-xl shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="메모 제목을 입력하세요"
              className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent transition"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/100
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="메모 내용을 입력하세요"
              className="w-full border border-gray-700 bg-[#1e1e1e] rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#ed374f] focus:border-transparent transition resize-none"
              rows={15}
              maxLength={5000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {content.length}/5000
            </div>
          </div>

          {/* 메타 정보 */}
          {currentMemo && (
            <div className="pt-4 border-t border-gray-700 text-xs text-gray-500 space-y-1">
              <div>작성일: {new Date(currentMemo.createdAt).toLocaleString("ko-KR")}</div>
              <div>수정일: {new Date(currentMemo.updatedAt).toLocaleString("ko-KR")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}