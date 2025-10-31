import { Plus, Trash2, FileDown, Upload } from "lucide-react";
import { useMemoStoreContext } from "../MemoStoreContext";
import { useNavigate } from "react-router-dom";
import { getTitleFromContent, getPreviewFromContent, formatDate } from "../utils/memoUtils";
import { useState } from "react";

export default function MemoListScreen() {
  const { ready, items, createMemo, deleteMemo, exportData, importData } = useMemoStoreContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  function handleCreateNew() {
    const newMemo = createMemo();
    navigate(`/app/memo/${newMemo.id}`, { state: { memo: newMemo } });
  }

  function handleMemoClick(id: string) {
    navigate(`/app/memo/${id}`);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMemo(id);
    }
  }

  function handleExport() {
    if (items.length === 0) {
      setMessage("내보낼 메모가 없습니다.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const filename = `memo-backup-${yyyy}${mm}${dd}-${HH}${MM}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("백업 파일을 내려받았습니다.");
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = importData(parsed);
      if (result.ok) {
        setMessage("백업 데이터를 불러왔습니다.");
      } else {
        setMessage(result.message ?? "불러오기 실패");
      }
    } catch (err) {
      console.error(err);
      setMessage("JSON 파싱 실패");
    } finally {
      e.target.value = "";
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        메모장 불러오는 중...
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">메모장</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-transparent border-2 border-gray-400 hover:border-gray-300 text-gray-300 hover:text-gray-100 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>내보내기</span>
            </button>
            <label className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-transparent border-2 border-gray-400 hover:border-gray-300 text-gray-300 hover:text-gray-100 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>불러오기</span>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-gray-700 rounded text-sm text-gray-200">
            {message}
          </div>
        )}

        {/* 메모 리스트 */}
        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="mb-4">아직 메모가 없습니다.</p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#ed374f] hover:bg-[#d21731] text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>첫 메모 작성하기</span>
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((memo) => {
                const title = getTitleFromContent(memo.content);
                const preview = getPreviewFromContent(memo.content);

                return (
                  <div
                    key={memo.id}
                    onClick={() => handleMemoClick(memo.id)}
                    className="bg-[#2b2b2b]/95 rounded-xl p-4 cursor-pointer hover:shadow-[0_0_10px_rgba(237,55,79,0.3)] transition-shadow flex items-start justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-100 truncate mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                        {preview}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(memo.updatedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(memo.id, e)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-100/10 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Floating Action Button */}
            <button
              type="button"
              onClick={handleCreateNew}
              className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ed374f] hover:bg-[#d21731] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50"
            >
              <Plus className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}