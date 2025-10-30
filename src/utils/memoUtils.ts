export function getTitleFromContent(content: string): string {
  const firstLine = content.split("\n")[0].trim();
  return firstLine || "제목 없음";
}

export function getPreviewFromContent(content: string): string {
  const lines = content.split("\n");
  const preview = lines.slice(1, 3).join(" ").trim();
  return preview || "내용 없음";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  }
}