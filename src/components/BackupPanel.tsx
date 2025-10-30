import React, { useRef, useState } from "react";
import { useLedgerStoreContext } from "../LedgerStoreContext";

export default function BackupPanel() {
  const { exportData, importData } = useLedgerStoreContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 백업 저장하기: 현재 데이터를 JSON파일로 다운로드
  function handleDownload() {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });

    // 파일명: ledger-backup-YYYYMMDD-HHMMSS.json
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const SS = String(now.getSeconds()).padStart(2, "0");

    const filename = `ledger-backup-${yyyy}${mm}${dd}-${HH}${MM}${SS}.json`;

    const url = URL.createObjectURL(blob);

    // 가짜 <a> 태그 클릭해서 다운로드 트리거
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
    setMessage("백업 파일을 내려받았습니다.");
  }

  // 백업 불러오기: 파일 선택 → 읽어서 importData 호출
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      // 같은 파일 다시 선택할 수 있도록 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function triggerUpload() {
    fileInputRef.current?.click();
  }

  return (
    <div className="bg-[#2b2b2b]/95 text-gray-100 rounded-xl shadow-[0_0_3px_rgba(255,255,255,0.35)] p-6 backdrop-blur-md transition-shadow">
      <h2 className="text-lg font-semibold mb-2">백업 / 복원</h2>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <button
          onClick={handleDownload}
          className="bg-gray-800 hover:bg-black text-white text-xs font-medium rounded-lg px-3 py-2 transition-colors"
        >
          백업 저장하기 (JSON)
        </button>

        <button
          onClick={triggerUpload}
          className="bg-gray-200 hover:bg-gray-400 text-gray-800 text-xs font-medium rounded-lg px-3 py-2 transition-colors border border-gray-400"
        >
          백업 불러오기 (JSON)
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {message && (
        <p className="text-[11px] text-gray-500 mt-3">{message}</p>
      )}

      <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
        "백업 저장하기"로 받은 .json 파일만 있으면
        다른 PC나 브라우저에서도 "백업 불러오기"로 그대로 복구할 수 있습니다.
        (주의: 복원 시 현재 기록은 덮어쓰기됩니다.)
      </p>
    </div>
  );
}