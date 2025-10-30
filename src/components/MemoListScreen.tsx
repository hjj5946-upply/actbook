import { useState } from "react";
import { Plus, Trash2, FileDown, Upload } from "lucide-react";
import { useMemoStoreContext } from "../MemoStoreContext";
import { useNavigate } from "react-router-dom";

export default function MemoListScreen() {
  const { ready, items, removeItem, exportData, importData } = useMemoStoreContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  function handleCreateNew() {
    navigate("/app/memo/new");
  }

  function handleMemoClick(id: string) {
    navigate(`/app/memo/${id}`);
  }

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation(); // 메모 클릭 이벤트 방지
    if (confirm("정말 삭제하시겠습니까?")) {
      removeItem(id);
    }
  }

  function handleExport() {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const SS = String(now.getSeconds()).padStart(2, "0");
    const filename = `memo-backup-${yyyy}${mm}${dd}-${HH}${MM}${SS}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("백업 파일을 내려받았습니다.");
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
              onClick={handleExport}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-transparent border-2 border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>내보내기</span>
            </button>
            <label className="flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-transparent border-2 border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
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

        {/* 새 메모 버튼 */}
        <button
          onClick={handleCreateNew}
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#ed374f] hover:bg-[#d21731] text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>새 메모 작성</span>
        </button>

        {/* 메모 리스트 */}
        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            아직 메모가 없습니다. 새 메모를 작성해보세요!
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((memo) => (
              <div
                key={memo.id}
                onClick={() => handleMemoClick(memo.id)}
                className="bg-[#2b2b2b]/95 rounded-xl p-4 cursor-pointer hover:shadow-[0_0_10px_rgba(237,55,79,0.3)] transition-shadow flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-100 truncate">
                    {memo.title || "제목 없음"}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {memo.content || "내용 없음"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(memo.updatedAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(memo.id, e)}
                  className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-100/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}